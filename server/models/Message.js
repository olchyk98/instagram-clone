const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    content: String,
    type: String,
    creatorID: String,
    conversationID: String,
    time: Date,
    seen: Boolean
});

module.exports = mongoose.model("Message", MessageSchema);