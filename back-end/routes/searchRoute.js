const router = require('express').Router()
const usersData = require('../schema/usersDataSchema')
const blogpostsData = require('../schema/blogpostsSchema')
const commentsData = require('../schema/commentsSchema')
const { customError } = require('../middlewares/error')


router.get('/searchblogposts', async (req, res, next) => {
    const { query: { title, body, catigory, tag, skip = 0, limit = 0 }, session } = req

    // search conditions logic array varible
    const conditions = []

    if (title) conditions.push({ 'title': { $regex: title, $options: 'i' } }) // search by title 

    if (body) conditions.push({ 'body': { $regex: body, $options: 'i' } }) // search by body 

    if (catigory) conditions.push({ 'catigories': { $regex: catigory, $options: 'i' } }) // search by catigories 

    if (tag) conditions.push({ 'tags': { $regex: '#' + tag, $options: 'i' } }) // search by search logic

    try {

        if (!conditions.length ||
            !session.searchHistory.length
        ) throw new Error('not found: epmty field or no session search history array provided')

        // search through all blogpost return search result
        const searchedBlogposts = await blogpostsData
            .find({ $or: conditions })
            .skip(skip)
            .limit(limit)

        if (!searchedBlogposts.length) throw new Error('not found: no blogpost found')

        // attach every sucessfull search query to the search session history
        session.searchHistory.push({ title, body, catigory, tag })

        res.json(searchedBlogposts)

    } catch (error) {

        next(new customError(error, 404))
    }
})

router.get('/searchusers', async (req, res, next) => {
    const { query: { userName, name, skip = 0, limit = 0 }, session } = req

    // search conditions logic array varible
    const conditions = []

    if (userName) conditions.push({ 'userName': { $regex: userName, $options: 'i' } }) // userName search logic

    if (name) conditions.push({ 'name': { $regex: name, $options: 'i' } }) // name search logic

    try {

        if (!conditions.length ||
            !session.searchHistory.length
        ) throw new Error('not found: epmty field or no session search history array provided')

        // search through all users and return search result
        const searchedUsers = await usersData
            .find({ $or: conditions })
            .skip(skip)
            .limit(limit)
            .select('email userName name displayImage bio sex followers following interests _id updatedAt createdAt')

        if (!searchedUsers.length) throw new Error('not found: no user found')

        // attach every sucessfull search query to the search session history
        session.searchHistory.push({ userName, name })

        // send out only unsensetive data of users
        res.json(searchedUsers)

    } catch (error) {

        next(new customError(error, 404))
    }
})

module.exports = router
