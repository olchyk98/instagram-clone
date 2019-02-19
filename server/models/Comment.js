const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    postID: String,
    creatorID: String,
    content: String,
    likes: Array,
    time: String
});

module.exports = mongoose.model("Comment", CommentSchema);
