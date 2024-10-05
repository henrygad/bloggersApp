const authorization = require("../middlewares/authorization")
const createimage = require("../middlewares/createimage")
const { customError } = require("../middlewares/error")
const router = require("express").Router()
const blogpostsData = require('../schema/blogpostsSchema')
const mongoose = require('mongoose')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get('/blogposts', async (req, res, next) => {
    const { query: { skip = 0, limit = 0 } } = req

    try {

        // get all blogposts
        const blogposts = await blogpostsData
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        if (!blogposts.length) throw new Error('Not Found: no blogposts found')

        res.json(blogposts)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogposts/:authorUserName/:slug', async (req, res, next) => {
    const { params: { authorUserName, slug } } = req

    try {

        if (!authorUserName.startsWith('@') ||
            slug.trim() === ' '
        ) throw new Error('Bad Request: invalid username!')

        const url = authorUserName + '/' + slug;
        const blogpost = await blogpostsData.findOne({ url })

        if (!blogpost) throw new Error('Not Found: no blogpost found')

        res.json(blogpost);
    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogposts/:authorUserName', authorization, async (req, res, next) => {
    const { params: { authorUserName }, query: { skip = 0, limit = 0 } } = req

    try {

        if (!authorUserName.startsWith('@')) throw new Error('Bad Request: invalid username!')

        // get all user blogposts
        const userBlogposts = await blogpostsData
            .find({ authorUserName })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        if (!userBlogposts.length) throw new Error('Not Found: no blogposts found')

        res.json(userBlogposts)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/feed/timeline/:timeline', authorization, async (req, res, next) => {
    const { params: { timeline }, query: { skip = 0, limit = 0 } } = req

    try {

        if (timeline.trim() === '') throw new Error('Bad Request: empty field!')

        const getArrOfTimeline = timeline.split('&');
        getArrOfTimeline.map(item => {
            if (!item.startsWith('@')) throw new Error('Bad Request: invalid username!')
        })

        const getFeeds = await blogpostsData
            .find({ authorUserName: { $in: getArrOfTimeline } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        if (!getFeeds.length) throw new Error('Bad Request: no blogpost found!')

        res.json(getFeeds)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.post('/addblogpost', authorization, upload.single('blogpostimage'), createimage, async (req, res, next) => {
    const { authorizeUser } = req
    const body = JSON.parse(req.body.data)

    try {

        if (!body.slug) throw new Error('Bad Request: empty field!')

        if (body.authorUserName) throw new Error('Bad Request: reject!')

        //check for duplication
        let validataSlug = '';

        const getAllBlogpost = await blogpostsData.findOne({ slug: body.slug })
        if (getAllBlogpost) {
            validataSlug = body.slug + Date.now(); // for duplicated slugs
        } else {
            validataSlug = body.slug
        } //throw new Error('Bad Request: duplicated blogpost with the same slug not allowed!')

        const validatedBody = {
            displayImage: req.image ? req.image : '',
            authorUserName: authorizeUser,
            title: body.title,
            body: body.body,
            _html: body._html,
            catigory: body.catigory,
            mentions: !body.mentions,
            slug: validataSlug,
            url: `${authorizeUser}/${validataSlug}`,
            status: 'published',
        }

        // create blogpost
        const addBlogpost = await blogpostsData.create({ ...validatedBody })

        if (!addBlogpost) throw new Error('Bad Request: blogpost not created!')

        res.json(addBlogpost)

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/editblogpost/:_id', authorization, upload.single('image'), createimage, async (req, res, next) => {
    const { params: { _id } } = req
    const body = JSON.parse(req.body.data)

    try {

        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: invalid blogpost id!')

        // validate body

        // update this blogpost
        const updateBlogpost = await blogpostsData.findByIdAndUpdate({ _id },
            {
                displayImage: req.image ? req.image : '',
                title: body?.title,
                body: body?.body,
                _html: body?._html,
                catigories: body?.catigories,
                mentions: body?.mentions,
                status: body?.status
            },
            { new: true }
        )
        if (!updateBlogpost) throw new Error('Bad Request: blogpost was not updated!')

        res.json(updateBlogpost)

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.delete('/deleteblogpost/:_id', authorization, async (req, res, next) => {
    const { params: { _id, } } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

        // delete blogpost
        const deleteBlogpost = await blogpostsData.findByIdAndDelete({ _id })
        if (!deleteBlogpost) throw new Error('Bad Request: blogpost was not deleted')

        res.json({ deleted: 'sucessfully deleted blogpost' })

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/likeblogpost/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, authorizeUser } = req
    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

        // check if the blogpost has beem liked by this user, if yes return
        const getBlogpost = await blogpostsData.findById({ _id });
        if (getBlogpost.likes.includes(authorizeUser)) throw new Error('Bad Request: blogpost already been liked by this user!')

        // like blogpost
        const likedBlogpost = await blogpostsData.findByIdAndUpdate({ _id: getBlogpost._id },
            { $push: { likes: authorizeUser } },
            { new: true }
        )
        if (!likedBlogpost.likes) throw new Error('Bad Request: blogpost was not liked!')

        res.json(likedBlogpost.likes);

    } catch (error) {
        next(new customError(error, 400))
    }
})

router.patch('/unlikeblogpost/:_id', authorization, async (req, res, next) => {
    const { params: { _id }, authorizeUser } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

        // unlike blogpost
        const unlikedBlogpost = await blogpostsData.findByIdAndUpdate({ _id },
            { $pull: { likes: authorizeUser } },
            { new: true }
        )
        if (!unlikedBlogpost.likes) throw new Error('Bad Request: blogpost was not unliked!')

        res.json(unlikedBlogpost.likes);

    } catch (error) {
        next(new customError(error, 400))
    }
})

router.patch('/shareblogpost/:_id', async (req, res, next) => {
    const { params: { _id }, session } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

        let sharedBogpost = null
        const getBlogpost = await blogpostsData.findById({ _id })

        if (getBlogpost.shares.includes(session.id)) { // if this user (browser) has share this blogpost, then retrun the exising data
            sharedBogpost = getBlogpost.shares
        } else { // add new you session id to the blospost shares
            const response = await blogpostsData.findByIdAndUpdate({ _id: getBlogpost._id },
                { $push: { shares: session.id } },
                { new: true }
            )
            sharedBogpost = response.shares
        }
        if (!sharedBogpost) throw new Error('Bad Request: blogpost shared was not added!');

        res.json(sharedBogpost)
    } catch (error) {
        next(new customError(error, 400))
    }
})

router.patch('/viewblogpost/:_id', async (req, res, next) => {
    const { params: { _id }, session } = req

    try {
        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: empty field!')

        let viewedBlogpost = null
        const getBlogpost = await blogpostsData.findById({ _id })

        if (getBlogpost.views.includes(session.id)) {
            viewedBlogpost = getBlogpost.views
        } else {
            const response = await blogpostsData.findByIdAndUpdate({ _id: getBlogpost._id },
                { $push: { views: session.id } },
                { new: true }
            )

            viewedBlogpost = response.views
        }
        if (!viewedBlogpost) throw new Error('Bad Request: blogpost view was not added!')

        res.json(viewedBlogpost)
    } catch (error) {
        next(new customError(error, 400))
    }
})

module.exports = router
