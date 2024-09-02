const jwt = require('jsonwebtoken')
const authenticatedUsers = require('../schema/authenticatedUsersSchema')
const {customError} = require('../middlewares/error')
require('dotenv').config()

const SECRETE = process.env.SECRETE

const authorization = async (req, res, next) => {
    const { session: { jwtToken } } = req

    try {

        // check if jwtToken is provided
        if (!jwtToken) throw new Error('Unauthorized: no token provided!')

        // verify jwtToken 
        jwt.verify(jwtToken, SECRETE, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    throw new Error('Unauthorized: token expired!')
                }
                throw new Error('Unauthorized: invalid token!' )
            }

            // if the token is valid
            req.user = decoded
        });

        // check if this user is an authenticated user
        const authenticateUser = await authenticatedUsers.findById(req.user._id)
        if (!authenticateUser) throw new Error('Unauthorized: no user was found!')

        // if user is found
        req.authorizeUser = authenticateUser.userName

        next()
    } catch (error) {
        
        next(new customError(error, 401))
    }
}


module.exports = authorization;