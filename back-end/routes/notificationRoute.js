const { default: mongoose } = require('mongoose')
const authorization = require('../middlewares/authorization')
const { customError } = require('../middlewares/error')
const usersData = require('../schema/usersDataSchema')
const router = require('express').Router()

router.patch('/notification/:userToNotify', authorization, async (req, res, next) => {
    const { params: { userToNotify }, body } = req

    try {

        // check if it is a valid username
        if (!userToNotify.startsWith('@')) throw new Error('bad request: empty fields or invalid userName')

        // validate and sanitize body
        const bodySanitized = {
            ...body,
            checked: false,
        };

        // check if the user exist
        const getUser = await usersData.findOne({ userName: userToNotify })
        if (!getUser) throw new Error('bad request: user not found')

        // notify user
        const notifed = await usersData.findOneAndUpdate({ userName: getUser.userName },
            { $push: { notifications: bodySanitized } },
            { new: true }
        )
        if (!notifed.notifications) throw new Error('Bad request: user not notifed')

        res.json(notifed.notifications)
    } catch (error) {
        next(new customError(error, 400))
    }

})

router.patch('/editnotification/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, authorizeUser } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

       // edit notification
        const updataNotification = await usersData.findOneAndUpdate(
            { userName: authorizeUser, "notifications._id": _id },
            { $set: { "notifications.$.checked": true } },
            { new: true }
        )
        if (!updataNotification.notifications) throw new Error('Bad request: notificaton was not updated!')
            
        res.json(updataNotification.notifications)
    } catch (error) {
        next(new customError(error, 400))
    }
})

router.patch('/deletenotification/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, authorizeUser } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

        // delete notification
        const deleteNotification = await usersData.findOneAndUpdate({ userName: authorizeUser },
            { $pull: { notifications: { _id } } },
            { new: true }
        )
        if (!deleteNotification.notifications) throw new Error('Bad request: notificaton was not deleted!')

        res.json(deleteNotification.notifications)
    } catch (error) {
        next(new customError(error, 400))
    }
})

module.exports = router
