const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
    altDescription: String,
    url: String,
    type: String,
    postID: String
});

module.exports = mongoose.model("Media", MediaSchema);
