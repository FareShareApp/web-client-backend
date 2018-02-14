var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	destination: String, 
	desiredTime: Date,
	requester: mongoose.Schema.ObjectId,
	timeBuffer: Number
});

module.exports = mongoose.model('Request', RequestSchema);
