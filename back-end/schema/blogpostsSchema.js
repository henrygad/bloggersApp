const mongoose = require('mongoose')

const blogpostsData = new mongoose.Schema({
    displayImage: { type: String },
    authorUserName: { type: String },
    title: { type: String },
    body: { type: String },
    _html: { title: String, body: String },
    catigory: { type: String },
    mentions: { type: String },
    slug: { type: String, unique: true },
    url: { type: String, unique: true },
    likes: [String],
    views: [String],
    shares: [String],
    status: { type: String, default: 'archived' },
},
    {
        timestamps: true
    })


module.exports = mongoose.model("Blogposts", blogpostsData)
