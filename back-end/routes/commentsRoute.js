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
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        if (!comments.length) throw new Error('Not Found: no comment found')

        res.json(comments)
    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/comments/:_id', async (req, res, next) => {
    const { params: { _id }} = req

    try {
        // verify comment id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Not Found: invalid comment id')

        // get single comments for user
        const comment = await commentsData
            .findById({ _id })
            .populate({
                path: 'children',
                populate: {
                    path: 'children',
                    populate: {
                        path: 'children',
                    }
                }
            }) // recursive populate nested comment

        if (!comment) throw new Error('Not Found: no comment was found')
        res.json(comment)

    } catch (error) {
        next(new customError(error, 404))
    }
})

router.get('/blogpostcomments/:blogpostId', async (req, res, next) => {
    const { params: { blogpostId, authorizeUser }, query: { skip = 0, limit = 0 } } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(blogpostId)) throw new Error('Not Found: invalid blogpost id')

        // get single comments for user
        const comment = await commentsData
            .find({ parentId: null, blogpostId })
            .populate({
                path: 'children',
                populate: {
                    path: 'children',
                    populate: {
                        path: 'children',
                    }
                }
            }) // recursive populate nested comment
            .skip(skip)
            .limit(limit)

        if (!comment) throw new Error('Not Found: no comment was found')
        res.json(comment)

    } catch (error) {
        next(new customError(error, 404))
    }
})

router.get('/usercomments/:authorUserName', authorization, async (req, res, next) => {
    const { params: { authorUserName }, query: { skip = 0, limit = 0 } } = req

    try {

        // get all user comments
        const userComments = await commentsData
            .find({ authorUserName })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        if (!userComments.length) throw new Error('Not Found: no comment found')

        res.json(userComments)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.post('/addcomment', authorization, async (req, res, next) => {
    const { authorizeUser, body } = req

    try {

        // varify comment id
        if (!mongoose.Types.ObjectId.isValid(body.blogpostId)) throw new Error('bad request: invalid blogpost id')

        // validate body

        // create blogpost
        const addComment = await commentsData.create({ authorUserName: authorizeUser, ...body })
        if (!addComment) throw new Error('bad request: comment not created ')

        if (body.parentId) {// new comment is a child comment, push it id to it parent arrar of child key
            if (!mongoose.Types.ObjectId.isValid(body.parentId)) throw new Error('bad request: invalid comment id')

            await commentsData.findByIdAndUpdate({ _id: body.parentId }, {
                $push: { children: addComment._id }
            })
        }

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
        const updateComment = await commentsData.findByIdAndUpdate({ _id },
            { body, mentions },
            { new: true }
        )
        if (!updateComment) throw new Error('bad request: comment not updated')

        res.json(updateComment)

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

router.patch('/likecomment/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, authorizeUser } = req

    try {
        // verify comment id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('bad request: inavlid comment is')

        // // check if the comment has beem liked by this user, if yes return
        const getComment = await commentsData.findById({ _id })
        if (getComment.likes.includes(authorizeUser)) throw new Error('Bad Request: comment already been liked by this user!')

        // like comment
        const likedComment = await commentsData.findByIdAndUpdate({ _id: getComment._id },
            { $push: { likes: authorizeUser } },
            { new: true }
        )
        if (!likedComment.likes) throw new Error('Bad Request: comment was not liked!')

        res.json(likedComment.likes)
    } catch (error) {
        next(new customError(error, 400))
    }
})

router.patch('/unlikecomment/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, authorizeUser } = req

    try {
        // verify comment id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('bad request: inavlid comment is')

        // unlik comment 
        const unlikedComment = await commentsData.findByIdAndUpdate({ _id },
            { $pull: { likes: authorizeUser } },
            { new: true }
        )
        if (!unlikedComment.likes) throw new Error('Bad Request: comment was not unliked!')

        res.json(unlikedComment.likes)
    } catch (error) {
        next(new customError(error, 400))
    }
})

router.patch('/sharecomment/:_id', async (req, res, next) => {
    const { params: { _id }, session } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

        let sharedComment = null
        const getComment = await commentsData.findById({ _id })

        if (getComment.shares.includes(session.id)) { // if this user (browser) has share this comment, then retrun the exising data
            sharedComment = getComment.shares
        } else { // add new you session id to the comment shares
            const response = await commentsData.findByIdAndUpdate({ _id: getComment._id },
                { $push: { shares: session.id } },
                { new: true }
            )
            sharedComment = response.shares
        }
        if (!sharedComment) throw new Error('Bad Request: comment shared was not added!');

        res.json(sharedComment)
    } catch (error) {
        next(new customError(error, 400))
    }
})

module.exports = router
