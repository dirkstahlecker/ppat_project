var mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
	number: Number,
	description: String,
	image: 
});


module.exports = mongoose.model('Exercise', exerciseSchema);