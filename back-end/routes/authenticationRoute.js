const router = require('express').Router()
const authenticatedUsers = require('../schema/authenticatedUsersSchema')
const usersData = require('../schema/usersDataSchema')
const hashPassword = require('../utils/hashPassword')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcypt = require('bcryptjs')
const authorization = require('../middlewares/authorization')
const { customError } = require('../middlewares/error')
require('dotenv').config()

const SECRETE = process.env.SECRETE

router.get('/status', authorization, (req, res, next) => {
    const { authorizeUser, session, } = req
    try {

        if (!session?.searchHistory?.length) {
            session.searchHistory = [] // add an arr of search history property to the session for the first time
        }

        const isLogin = session?.isLogin
        res.json({
            greetings: `Hi! ${authorizeUser} you, ${isLogin ? ' login' : ' loged out'}`,
            isLogin,
            loginUserName: authorizeUser,
            sessionId: session.id,
            searchHistory: session.searchHistory,
        })

    } catch (error) {
        next(new customError(error, 400))
    }

})

router.post('/signup', async (req, res, next) => {
    const { body: { userName, email, password, comfirmPassword }, session } = req

    try {

        if (!userName.trim() ||
            !email.trim() ||
            !password.trim() ||
            !comfirmPassword.trim()
        ) throw new Error('All field must been fill!') // if one field is empty reject request

        // validate username, email, password, comfirmPassword for malicious attack
        if (!validator.isLength(userName, { min: 5 })) throw new Error('Username must be atleat 5 letters!')
        if (!validator.isEmail(email)) throw new Error('Invalid email!')
        if (!validator.isStrongPassword(password)) throw new Error('Password is not strong enough!')

        const validatedUserName = validator.escape(userName)  // Sanitize username (i.e, replace code syntax to html entities)

        const userNameUnavialiable = await authenticatedUsers.findOne({ userName: '@' + validatedUserName })  // check if username is available
        if (userNameUnavialiable) throw new Error('This username is unavaliable!')

        const emailUnavialable = await authenticatedUsers.findOne({ email }) // also check if therr is a user with this email
        if (emailUnavialable) throw new Error('There is an account with this email, try login!')

        if (password.trim() !== comfirmPassword.trim()) throw new Error('Passwords did not match') // comfirm whether password and comfirmation password is the same for accurrancy

        const hashedPassword = hashPassword(password) // hash password 

        const newUserData = {
            userName: '@' + validatedUserName,
            email,
            password: hashedPassword
        };

        const createUser = await authenticatedUsers.create(newUserData)   // create a new authenticated user
        if (!createUser) throw new Error('Bad resquest: user was not created')

        await usersData.create({ userName: createUser.userName, email: createUser.email, timeline: [createUser.userName] }) // create a new user space for each new user

        const token = jwt.sign({ _id: createUser._id }, SECRETE, { expiresIn: '1h' }) // generate authentication token and assign it to user
        req.session.jwtToken = token // attach authentication  token to req property
        req.session.isLogin = req.session.jwtToken && true // login user
        const isLogin = req.session.isLogin

        res.json({  //send back athorizetion
            greetings: `Hi! ${createUser.userName}`,
            isLogin,
            loginUserName: createUser.userName,
            sessionId: session.id,
            searchHistory: session.searchHistory,
        })

    } catch (error) {

        next(new customError(error, 500))
    }
})

router.post('/login', async (req, res, next) => {
    const { body: { value, password }, session } = req

    try {

        if (!value.trim() ||
            !password.trim()
        ) throw new Error('Fields are empty!') // if fields are empty

        let userExist = null // declear a exiting user varible

        userExist = await authenticatedUsers.findOne({ userName: "@" + value }) // check if user already exist by username 
        if (!userExist) userExist = await authenticatedUsers.findOne({ email: value })  // if user does'nt already exist by userName, check if user exist by email
        if (!userExist) throw new Error('Invalid credentials!')  // if user does'nt exist either by userName or email
        const validPassword = bcypt.compareSync(password, userExist.password) // compare raw password with hashed password
        if (!validPassword) throw new Error('Invalid credentials!') // if password is not valid

        if (session.jwtTokenExpired) {
            console.log('creating new jwt token')
            const token = jwt.sign({ _id: userExist._id }, SECRETE, { expiresIn: '1h' }) // generate authentication token and assign it to user
            req.session.jwtToken = token // attach authentication  token to req property
            req.session.isLogin = req.session.jwtToken ? true : false // login user
        } else {
            req.session.isLogin = true // login user 
        }

        const isLogin = req.session.isLogin // get login  status
        res.json({ //send back athorizetion
            greetings: `Hi! ${userExist.userName}`,
            isLogin,
            loginUserName: userExist.userName,
            sessionId: session.id,
            searchHistory: session.searchHistory,
        })

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.post('/logout', authorization, async (req, res, next) => {
    const { authorizeUser, session } = req
    try {
        session.isLogin = false // logout user
        const isLogin = session.isLogin
        res.json({
            isLogin,
            loginUserName: '',
            greetings: `Hi! ${authorizeUser} you loged out `,
            sessionId: session.id,
            searchHistory: session.searchHistory,
        })

    } catch (error) {
        next(new customError(error, 400))
    }
})

router.post('/forgetpassword', async (req, res, next) => {
    const { body: { value } } = req
    let userExist = null

    try {

        // if fields are empty
        if (!value) throw new Error('empty field!')

        // check if user already exist by username 
        userExist = await authenticatedUsers.findOne({ userName: "@" + value })

        // if user does'nt already exist by userName, check if user exist by email
        if (!userExist) userExist = await authenticatedUsers.findOne({ email: value })

        // if user does'nt exist either by userName or email
        if (!userExist) throw new Error(`no user with this ${value}!`)

        // send a part to change password
        res.json({ email: userExist.email, url: `api/changeforgetpassword/:${tokenFor30min}` })

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/changeforgetpassword/:jwtTokenFor30min', async (req, res, next) => {
    const { params: { jwtTonkenFor30min } } = req

    try {

        // if fields are empty
        if (!jwtTonkenFor30min) throw new Error('empty field!')

        // validate jwtTonkenFor30min

        // check if user exist by email
        const userExist = await authenticatedUsers.findOne({ email: value })
        if (!userExist) throw new Error('invalid credentials!')

        // allowed this user to change password
        res.json({ userName: userExist.userName, email: userExist.email })

    } catch (error) {

        next(new customError(error, 400))
    }
})

module.exports = router
