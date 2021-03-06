const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    login: String,
    name: String,
    bio: String,
    email: String,
    gender: String,
    password: String,
    savedPosts: Array,
    avatar: String,
    isVerified: Boolean,
    authTokens: Array,
    subscribedTo: Array,
    registeredByExternal: Boolean
});

module.exports = mongoose.model("User", UserSchema);
