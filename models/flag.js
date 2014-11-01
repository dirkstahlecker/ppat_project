var mongoose = require('mongoose');

var flagSchema = mongoose.Schema({
	color: String,
	icon: ,
	description: String,
	image: ,
	latitude: Number,
	longitude: Number
});


module.exports = mongoose.model('Flag', flagSchema);