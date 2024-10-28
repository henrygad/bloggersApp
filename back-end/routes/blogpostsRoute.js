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
    const { query: {status = 'published', skip = 0, limit = 0 } } = req

    try {
        const blogposts = await blogpostsData // get all blogposts
            .find({status})
            .skip(skip)
            .limit(limit)
        if (!blogposts.length) throw new Error('Not Found: no blogposts found')

        res.json(blogposts.sort((a, b) => b.views.length - a.views.length))

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogposts/:authorUserName', authorization, async (req, res, next) => {
    const { params: { authorUserName }, query: {status = 'published', skip = 0, limit = 0 } } = req

    try {

        if (!authorUserName.startsWith('@')) throw new Error('Bad Request: invalid username!')

        // get all user blogposts
        const userBlogposts = await blogpostsData
            .find({ authorUserName, status})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        if (!userBlogposts.length) throw new Error('Not Found: no blogposts found')

        res.json(userBlogposts)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogpost/:authorUserName/:slug', async (req, res, next) => {
    const { params: { authorUserName, slug } } = req
    const url = authorUserName + '/' + slug

    try {

        if (!url) throw new Error('Bad Request: invalid url!')

        const blogpost = await blogpostsData.findOne({ url })

        if (!blogpost) throw new Error('Not Found: no blogpost found')

        res.json(blogpost);
    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogposts/timeline/:timeline', authorization, async (req, res, next) => {
    const { params: { timeline }, query: { status = 'published', skip = 0, limit = 0 } } = req

    try {

        if (timeline.trim() === '') throw new Error('Bad Request: empty field!')

        const getArrOfUserNames = timeline.split('&');
        getArrOfUserNames.map(item => {
            if (!item.startsWith('@')) throw new Error('Bad Request: invalid username!')
        })

        const getFeeds = await blogpostsData
            .find({ authorUserName: { $in: getArrOfUserNames }, status})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        if (!getFeeds.length) throw new Error('Bad Request: no blogpost found!')

        res.json(getFeeds)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogposts/saves/:_ids', authorization, async (req, res, next) => {
    const { params: { _ids }, query: {status = 'published', skip = 0, limit = 0 } } = req

    try {

        if (_ids.trim() === '') throw new Error('Bad Request: empty field!')

        const getArrOfBlogpostIds = _ids.split('&');
        getArrOfBlogpostIds.map(_id => {
            if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: invalid blogpost id!') // verify blogpost id
        })

        const getSavedBlogpost = await blogpostsData
            .find({ _id: { $in: getArrOfBlogpostIds }, status})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        if (!getSavedBlogpost.length) throw new Error('Bad Request: no blogpost found!')

        res.json(getSavedBlogpost)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.post('/addblogpost', authorization, upload.single('blogpostimage'), createimage, async (req, res, next) => {
    const { authorizeUser } = req
    const body = JSON.parse(req.body.data)

    try {

        if (!body.slug) throw new Error('Bad Request: empty field!')

        //check for duplication
        let validataSlug = '';

        const blogpostSlugExist = await blogpostsData.findOne({ slug: body.slug }) // check if blogpost exist with is new blogpost slug
        if (blogpostSlugExist) {
            validataSlug = body.slug + Date.now(); // change the new blogpost slug
        } else {
            validataSlug = body.slug // else continue with the new blogpost slug
        }

        const validatedBody = {
            displayImage: req.image ? req.image : '',
            authorUserName: authorizeUser,
            title: body.title,
            body: body.body,
            _html: body._html,
            catigory: body.catigory,
            slug: validataSlug,
            url: `${authorizeUser}/${validataSlug}`,
            status: body.status || 'archived',
        }

        // create blogpost
        const addBlogpost = await blogpostsData.create({ ...validatedBody })

        if (!addBlogpost) throw new Error('Bad Request: blogpost not created!')

        res.json(addBlogpost)

    } catch (error) {

        next(new customError(error, 400))
    }
})

router.patch('/editblogpost/:_id', authorization, upload.single('blogpostimage'), createimage, async (req, res, next) => {
    const { params: { _id } } = req
    const body = JSON.parse(req.body.data)

    try {

        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: invalid blogpost id!') // verify blogpost id

        let sanitizedBody = {};

        if (req.image) {
            sanitizedBody = {
                displayImage: req.image,
                title: body.title,
                body: body.body,
                _html: body._html,
                catigories: body.catigories,
                status: body.status
            };
        } else {
            sanitizedBody = {
                title: body.title,
                body: body.body,
                _html: body._html,
                catigories: body.catigories,
                status: body.status
            };
        }

        const updateBlogpost = await blogpostsData.findByIdAndUpdate({ _id },  // update this blogpost
            { ...sanitizedBody },
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

        res.json({likes: likedBlogpost.likes});

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

router.patch('/blogposts/shares/:_id', async (req, res, next) => {
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
