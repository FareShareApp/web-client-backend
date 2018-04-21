var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName: {type: String, default: "Johnny"},
	lastName: {type: String, default: "Appleseed"},
	profileUrl: {type: String, default: "https://randomuser.me/api/portraits/lego/7.jpg"},
	email: String, 
	school: {type: String, default: "Northwestern University"}, 
	verified: {
		type: Boolean,
		default: false
	}});

module.exports = mongoose.model('User', UserSchema);