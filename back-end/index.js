const express = require("express")
const Mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const routes = require('./routes/index')
const session = require('express-session')
const { errorHandler, customError } = require("./middlewares/error")
const cors = require('cors')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 4000
const DBURI = process.env.DBURI
const SECRETE = process.env.SECRETE
const hour = 3600000
const corsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Custom-Header'],
    credentials: true,
}

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors(corsOptions))
Mongoose.set('strictQuery', false)

Mongoose.connect(DBURI, {})
    .then(() => {

        app.use(session({
            secret: SECRETE,
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: new Date(Date.now() + (hour * 2)), // 2 hour from now
                maxAge: (hour * 2), // live for 2 hour
                httpOnly: true, // Prevents JavaScript access
                secure: false,   // Ensures cookie is sent over HTTPS
                //sameSite: 'None', // Allows the cookie to be sent in all contexts
            },
            store: MongoStore.create({
                client: Mongoose.connection.getClient()
            })
        }))

        app.get('/api', (req, res) => {
            const { session } = req
            session.visited = true // modified session

            res.json({
                greetings: `Hi!, you ${session.isLogin ? 'login' : ' loged out'}`,
                sessionId: session.id,
                searchHistory: session.searchHistory,
            })
        })

        app.use('/api', routes)

        app.all('*', (req, res, next) => {
            next(new customError(`Can't find ${req.originalUrl} on this server!`, 404))
        })

        // Middleware
        app.use(errorHandler)

        app.listen(PORT, () => console.log('serving running on port' + ' ' + PORT))
    })
    .catch((err) => {

        const error = new customError('no network connected')
        console.log(error.message)
    })
