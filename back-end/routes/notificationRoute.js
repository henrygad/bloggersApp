const authorization = require('../middlewares/authorization')
const { customError } = require('../middlewares/error')
const usersData = require('../schema/usersDataSchema')
const router = require('express').Router()


router.patch('/addnotificationto/:userToNotify', authorization, async (req, res, next) => {
    const { params: { userToNotify }, body } = req

    try {

        if (
            !body.type ||
            !userToNotify.startsWith('@')
        ) throw new Error('bad request: empty fields or invalid userName')

        // validate and sanitize body

        // check if the user to notify exist
        const getUser = await usersData.findOne({ userName: userToNotify })
        if (!getUser) throw new Error('bad request: user not found')

        // notify user
        const notifed = await usersData.findOneAndUpdate(
            { userName: getUser.userName },
            { notifications: [...getUser.notifications, { _id: Date.now().toString(), ...body }] }
        )

        if (!notifed) throw new Error('bad request: user not notifed')

        res.json({ notifed: 'notifed sucessfully' })

    } catch (error) {

        next(new customError(error, 400))
    }

})

router.delete('/deletenotification/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, authorizeUser } = req

    try {

        if (!_id) throw new Error('bad request: empty field!')

        // get user to notify
        const getUser = await usersData.findOne({ userName: authorizeUser })
        if (!getUser) throw new Error('bad request: user not found!')

        // delete notification
        const deleteNotification = await usersData.findOneAndUpdate(
            { userName: authorizeUser },
            { notifications: getUser.notifications.filter((notification) => notification._id !== _id) }
        )

        if (!deleteNotification) throw new Error('bad request: notificaton was not deleted!')

        res.json({ _id })

    } catch (error) {

        next(new customError(error, 400))
    }

})

module.exports = router
