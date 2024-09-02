const router = require('express').Router()
const authorization = require('../middlewares/authorization')
const { customError } = require('../middlewares/error')
const usersData = require('../schema/usersDataSchema')


router.patch('/addfollowerto/:userToFollow', authorization, async (req, res, next) => {
    const { params: { userToFollow }, authorizeUser } = req

    try {

        if (!userName ||
            !userNameToNotify.startsWith('@')
        ) throw new Error('bad request: empty fields or invalid userName')

        // check if user to follow exist
        const getUser = await usersData.findOne({ userName: userToFollow })
        if (!getUser) throw new Error('bad request: no user was found')

        // check if already followed user
        const alreadyFollowing = getUser.followers.includes(authorizeUser)
        if (alreadyFollowing) throw new Error('bad request: user already followed')

        // follow user
        const followed = await usersData.findOneAndUpdate({ userName: getUser.userName }, { followers: [...getUser.followers, authorizeUser] })
        if(!followed) throw new Error('bad request: user was not followed')
            
        res.json({ followed: userToFollow})

    } catch (error) {

        next(new customError(error, 400))
    }

})

router.delete('/unfollowerfrom/:userToUnfollow', authorization, async (req, res, next) => {
    const { params: { userToUnfollow }, authorizeUser } = req

    try {

        if (!userName ||
            !userNameToNotify.startsWith('@')
        ) throw new Error('bad request: empty fields or invalid userName')
        
        // check if user exist
        const getUser = await usersData.findOne({ userName: userToUnfollow })
        if (!getUser) throw new Error('bad request: no user was found')

        // unfollow user
        const unFollowd = await usersData.findOneAndUpdate({ userName: getUser.userName }, { followers: getUser.followers.filter((user) => user !== authorizeUser) })
        if (!unFollowd) throw new Error('bad request: user not followed')

        res.json({ unFollowd: userToUnfollow })

    } catch (error) {

       next(new customError(error, 400))
    }

})

module.exports = router
