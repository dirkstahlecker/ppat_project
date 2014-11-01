var mongoose = require('mongoose');

var flagSchema = mongoose.Schema({
	color: String,
	icon: { data: Buffer, contentType: String },
	description: String,
	image: { data: Buffer, contentType: String },
	latitude: Number,
	longitude: Number
});

//image example code taken from here: https://gist.github.com/aheckmann/2408370


module.exports = mongoose.model('Flag', flagSchema);