const authorization = require("../middlewares/authorization")
const { customError } = require("../middlewares/error")
const router = require("express").Router()
const commentsData = require('../schema/commentsSchema')
const mongoose = require('mongoose')


router.get('/comments', async (req, res, next) => {
    const { query: { skip = 0, limit = 0 } } = req

    try {

        // get all user comments
        const comments = await commentsData
            .find()
            .skip(skip)
            .limit(limit)

        if (!comments.length) throw new Error('Not Found: no comment found')

        res.json(comments)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/comments/:authorUserName', authorization, async (req, res, next) => {
    const { params: { authorUserName }, query: { skip = 0, limit = 0 } } = req

    try {

        // get all user comments
        const userComments = await commentsData
            .find({ authorUserName })
            .skip(skip)
            .limit(limit)

        if (!userComments.length) throw new Error('Not Found: no comment found')

        res.json(userComments)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/comment/:_id', authorization, async (req, res, next) => {
    const { params: { _id } } = req

    try {

        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Not Found: invalid blogpost id')

        // get single comments for user
        const comment = await commentsData.findById({ _id })
        if (!comment) throw new Error('Not Found: no comment was found')

        res.json(comment)

    } catch (error) {
        next(new customError(error, 404))
    }
})

router.post('/addcomment', authorization, async (req, res, next) => {
    const { authorizeUser, body } = req

    try {

        // varify comment id
        if (!mongoose.Types.ObjectId.isValid(body.parentBlogpostId)) throw new Error('bad request: invalid blogpost  id')

        // validate body

        // create blogpost
        const addComment = await commentsData.create({ authorUserName: authorizeUser, ...body })
        if (!addComment) throw new Error('bad request: comment not created ')

        res.json(addComment)
    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/editcomment/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, body: {
        body,
        mentions,
    } } = req

    try {

        // varify comment id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('bad request: invalid comment id')

        // validate body

        // update comment
        const updateComment = await commentsData.findByIdAndUpdate({ _id }, { body, mentions })
        if (!updateComment) throw new Error('bad request: comment not updated')

        // grap the updated comment
        const getUpdatedComment = await commentsData.findById({ _id: updateComment._id })

        res.json(getUpdatedComment)

    } catch (error) {
        next(new customError(error, 400))
    }
})

router.delete('/deletecomment/:_id', authorization, async (req, res, next) => {
    const { params: { _id, } } = req

    try {

        // verify comment id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('bad request: inavlid comment is')

        // delete comment
        const deleteComment = await commentsData.findByIdAndDelete({ _id })
        if (!deleteComment) throw new Error('bad request: comment was not deleted')

        res.json({ deleted: 'sucessfully deleted comment' })

    } catch (error) {

        next(new customError(error, 400))
    }
})

module.exports = router