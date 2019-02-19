const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    creatorID: String,
    likes: Array,
    time: String,
    people: Array,
    places: Array
});

module.exports = mongoose.model("Post", PostSchema);
