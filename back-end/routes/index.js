const routers = require('express').Router()
const authenticationRoute = require('./authenticationRoute')
const usersRoute = require('./usersRoute')
const followersRoute = require('./followersRoute')
const notificationRoute = require('./notificationRoute')
const blogpostsRoute = require('./blogpostsRoute')
const commentsRoute = require('./commentsRoute')
const searchRoute = require('./searchRoute')
const imagesRoute = require('./imagesRoute')

module.exports = routers.use(
    authenticationRoute,
    usersRoute,
    blogpostsRoute,
    commentsRoute,
    followersRoute,
    notificationRoute,
    searchRoute,
    imagesRoute,
)