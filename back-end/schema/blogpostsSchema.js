const mongoose = require('mongoose')

const blogpostsData = new mongoose.Schema({
    displayImage: String,
    authorUserName: String,
    title: String,
    body: String,
    _html: { title: String, body: String },
    catigory: String,
    tags: String,
    mentions: String,
    slug: { type: String, unique: true },
    url: { type: String, unique: true },
    likes: Number,
    views: Number,
    status: String,
},
    {
        timestamps: true
    })


module.exports = mongoose.model("Blogposts", blogpostsData)