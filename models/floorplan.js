var mongoose = require('mongoose');

var floorplanSchema = mongoose.Schema({
	number: Number,
	description: String,
	image: { data: Buffer, contentType: String },
	url: String //for storing images hosted online
});


module.exports = mongoose.model('Floorplan', floorplanSchema);
