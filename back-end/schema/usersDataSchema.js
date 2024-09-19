const mongoose = require('mongoose')

const usersData = new mongoose.Schema({
    displayImage: String,
    email: String,
    userName: { type: String, unique: true},
    name: String,
    dateOfBirth: String,
    country: String,
    sex: String,
    website: String,
    phoneNumber: String,
    bio: { type: String, match: /[a-z]/ , max: 50},
    timeline: {type: [String]},
    followers: {type: [String]},
    following: {type: [String]},
    interests: {type: [String]},
    notifications: {type: []},
    chatIds: {type: []},
}, 
{
    timestamps: true

})

module.exports =  mongoose.model("users", usersData)