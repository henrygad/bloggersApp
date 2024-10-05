const router = require('express').Router()
const authorization = require('../middlewares/authorization')
const authenticatedUser = require('../schema/authenticatedUsersSchema')
const usersData = require('../schema/usersDataSchema')
const bcypt = require('bcryptjs')
const hashPassword = require('../utils/hashPassword')
const { customError } = require('../middlewares/error')
const createimage = require('../middlewares/createimage')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage })


router.get('/users', async (req, res, next) => {// all users
    const { query: { skip = 0, limit = 0 } } = req

    try {

        // get the login user data
        const users = await usersData
            .find()
            .skip(skip)
            .limit(limit)
            .select('email userName name displayImage bio sex followers following interests _id updatedAt createdAt')


        if (!users) throw new Error('Not Found: no user found')

        res.json(users)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/users/:userName', async (req, res, next) => { // single user
    const { params: { userName } } = req

    try {

        // get the login user data
        const users = await usersData
            .findOne({ userName })
            .select('email userName name bio country phoneNumber dateOfBirth website displayImage sex followers following interests updatedAt createdAt')

        if (!users) throw new Error('Not Found: no user found')

        res.json(users)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/authorizeduser', authorization, async (req, res, next) => { // single authorized user
    const { authorizeUser } = req

    try {

        // get the login user data
        const user = await usersData.findOne({ userName: authorizeUser })
        if (!user) throw new Error('Not Found: no user found')

        res.json(user)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.patch('/editprofile', authorization, upload.single('avater'), createimage, async (req, res, next) => {
    const { authorizeUser } = req

    try {
        if (!req.body.data) throw new Error('bad request: no data was sent')
        const body = JSON.parse(req.body.data)

        if (!body) throw new Error('bad request: empty field')

        //sanitized body
        const sanitizedBody = {
            displayImage: req.image ? req.image : '',
            name: body?.name,
            bio: body?.bio,
            dateOfBirth: body?.dateOfBirth,
            email: body?.email,
            phoneNumber: body?.phoneNumber,
            website: body?.website,
            country: body?.country,
            sex: body?.sex,
        }

        // update other user data
        const updateUserData = await usersData.findOneAndUpdate({ userName: authorizeUser }, 
            { ...sanitizedBody },
            {new: true}
        )
        if (!updateUserData) throw new Error('bad request: user data was not updated')

        res.json(updateUserData)

    } catch (error) {

        next(new customError(error, 400))
    }

})

router.delete('/deleteprofile', authorization, async (req, res, next) => {
    const { authorizeUser } = req

    try {
        // logout user
        req.session.jwtToken = null        

        // delete user authenticated data
        const deleteAuthenticatedUser = await authenticatedUser.findOneAndDelete({ userName: authorizeUser })
        if (!deleteAuthenticatedUser) throw new Error('bad request: user authenticated data was not deleted ')

        // delete user data            
        const deleteUserData = await usersData.findOneAndDelete({ userName: authorizeUser })
        if (!deleteUserData) throw new Error('bad request: user data was not deleted ')

        res.json({ deleted: 'we are sad to see you go' })

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/changepassword', authorization, async (req, res, next) => {
    const { body: { formalPassword, newPassword }, authorizeUser } = req

    try {

        if (
            !formalPassword ||
            !newPassword
        ) throw new Error('bad request: empty fields')

        // get the user formal password
        const getAuthenticatedUserPassword = await authenticatedUser.findOne({ userName: authorizeUser }).password

        // check if password is authenticated
        const checkOldPassword = bcypt.compareSync(formalPassword, getAuthenticatedUserPassword)
        if (!checkOldPassword) throw new Error('bad request: invalid credentials')

        // hash new password
        const hashedPassword = hashPassword(newPassword)

        // updated password
        const updateAuthenticatedUser = await authenticatedUser.findOneAndUpdate({ userName: authorizeUser }, { password: hashedPassword })
        if (!updateAuthenticatedUser) throw new Error('bad request: password was not changed')

        res.json({ password: 'password sucessfully change to' })

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/changeemail', authorization, async (req, res, next) => {
    const { body: { newEmail }, authorizeUser } = req

    try {

        if (!newEmail) new Error('bad request: empty fields')

        // validate new email

        // updated email
        const updateAuthenticatedUser = await authenticatedUser.findOneAndUpdate({ userName: authorizeUser }, { email: newEmail })
        if (!updateAuthenticatedUser) new Error('bad request: email was not updated')

        // grap the updated user data
        const getUpdatedAuthenticatedUser = await authenticatedUser.findOne({ userName: authorizeUser })

        res.json({ email: getUpdatedAuthenticatedUser.email })

    } catch (error) {

        next(new customError(error, 400))
    }
})

module.exports = router;
