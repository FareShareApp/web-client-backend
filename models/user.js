var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	profileUrl: String,
	email: String, 
	school: String, 
	verified: {
		type: Boolean,
		default: false
	}});

module.exports = mongoose.model('User', UserSchema);