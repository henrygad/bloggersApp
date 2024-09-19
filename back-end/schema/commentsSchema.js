const mongoose = require('mongoose')

const commentsData = new mongoose.Schema({
    authorUserName: { type: String, require: true },
    blogpostId: { type: mongoose.Schema.Types.ObjectId, require: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comments", default: null },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments", }],
    url: String,
    body: { _html: { type: String, require: true }, text: { type: String, require: true } },
    commentIsAReplyTo: [String],
    mentions: String,
    likes: [String],
    shares: [String],
},
    {
        timestamps: true
    })


module.exports = mongoose.model("Comments", commentsData)
