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
            .skip(skip)
            .limit(limit)

        if (!blogposts.length) throw new Error('Not Found: no blogposts found')

        res.json(blogposts)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogposts/:authorUserName', authorization, async (req, res, next) => {
    const { params: { authorUserName }, query: { skip = 0, limit = 0 } } = req

    try {

        // get all user blogposts
        const userBlogposts = await blogpostsData
            .find({ authorUserName })
            .skip(skip)
            .limit(limit)

        if (!userBlogposts.length) throw new Error('Not Found: no blogposts found')

        res.json(userBlogposts)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/blogpost/:_id', authorization, async (req, res, next) => {
    const { params: { _id } } = req

    try {

        // verify blogpost id
        if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error('Bad Request: invalid blogpost id!')

        // get user a single blogpost
        const blogpost = await blogpostsData.findById({ _id })
        if (!blogpost) throw new Error('Not Found: no blogpost found')

        res.json(blogpost)

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
        // validate body

        //check for duplication
        const getAllBlogpost = await blogpostsData.findOne({ slug: body.slug })
        if (getAllBlogpost) throw new Error('Bad Request: duplicated blogpost with the same slug not allowed!')

        // create blogpost
        const addBlogpost = await blogpostsData.create({
            authorUserName: authorizeUser,
            ...body,
            url: `${authorizeUser}/${body.slug}`,
            displayImage: req.image,
            status: 'published',
        })
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
        const updateBlogpost = await blogpostsData.findByIdAndUpdate({ _id }, {
            displayImage: !req.image,
            title: body?.title,
            body: body?.body,
            _html: body?._html,
            catigories: body?.catigories,
            tags: body?.tags,
            mentions: body?.mentions,
            status: body?.status
        })
        if (!updateBlogpost) throw new Error('Bad Request: blogpost was not updated!')

        // grap the updated blogpost
        const getUpdatedBlogpost = await blogpostsData.findById({ _id: updateBlogpost._id })

        res.json(getUpdatedBlogpost)

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

module.exports = router
