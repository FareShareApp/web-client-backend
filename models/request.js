var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
	destination: String, 
	desiredTime: Date,
	requester: {type: Schema.Types.ObjectId, ref: 'users'},
	timeBuffer: Number
});

module.exports = mongoose.model('Request', RequestSchema);