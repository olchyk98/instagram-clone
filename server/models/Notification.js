const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	action: String,
	initID: String,
	time: Date,
	influencedID: Array,
	subContent: String,
	composeID: String
});

module.exports = mongoose.model("Notification", NotificationSchema);