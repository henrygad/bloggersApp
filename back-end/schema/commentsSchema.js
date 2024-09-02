const mongoose = require('mongoose')

const commentsData = new mongoose.Schema({
    parentBlogpostId: String,
    parentCommentId: String,
    authorUserName: String,
    body: {_html: String, wholeText: String},
    mentions: {type: []},
}, 
{
    timestamps: true
})


module.exports =  mongoose.model("Comments", commentsData)