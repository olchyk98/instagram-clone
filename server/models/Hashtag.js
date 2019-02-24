const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HashtagSchema = new Schema({
    name: String,
    subscribers: Array
});

module.exports = mongoose.model("Hashtag", HashtagSchema);