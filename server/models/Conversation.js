const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    conversors: []
});

module.exports = mongoose.model("Conversation", ConversationSchema);