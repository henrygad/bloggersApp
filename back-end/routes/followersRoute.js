const router = require('express').Router()
const authorization = require('../middlewares/authorization')
const { customError } = require('../middlewares/error')
const usersData = require('../schema/usersDataSchema')


router.patch('/follow/:userToFollow', authorization, async (req, res, next) => {
    const { params: { userToFollow }, authorizeUser } = req

    try {

        if (!userToFollow.startsWith('@')) throw new Error('bad request: empty fields or invalid userName')

        // check if user to follow exist
        const getUser = await usersData.findOne({ userName: userToFollow })
        if (!getUser) throw new Error('bad request: this user was not found')

        // check if already followed this user
        const alreadyFollowed = getUser.followers.includes(authorizeUser)
        if (alreadyFollowed) throw new Error('bad request: already followed user')

        // follow this user
        const followed = await usersData.findOneAndUpdate({ userName: getUser.userName },
            { $push: { followers: authorizeUser } },
            { new: true }
        )
        if (!followed.followers) throw new Error('bad request: user was not followed')

        // add the userName to follow to the requestee following 
        const addFollowing = await usersData.findOneAndUpdate({ userName: authorizeUser }, {
            $push: { following: followed.userName }  // start from here
        })
        if (!addFollowing.following) throw new Error('bad request: user was not add to following')

        res.json({ followed: followed.userName })

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/unfollow/:userToUnfollow', authorization, async (req, res, next) => {
    const { params: { userToUnfollow }, authorizeUser } = req

    try {

        if (!userToUnfollow.startsWith('@')) throw new Error('bad request: empty fields or invalid userName')

        // check if user exist
        const getUser = await usersData.findOne({ userName: userToUnfollow })
        if (!getUser) throw new Error('bad request: this user was not found')

        // unfollow user
        const unFollowd = await usersData.findOneAndUpdate({ userName: getUser.userName },
            { $pull: { followers: authorizeUser } },
            { new: true }
        )
        if (!unFollowd.followers) throw new Error('bad request: user not followed')

        // delete the userName to unfollow from the requestee following 
        const removeFollowing = await usersData.findOneAndUpdate({ userName: authorizeUser }, {
            $pull: { following: unFollowd.userName }
        })
        if (!removeFollowing.following) throw new Error('bad request: user was not remove from following')

        res.json({ unFollowd: unFollowd.userName })

    } catch (error) {

        next(new customError(error, 400))
    }

})

module.exports = router
