var mongoose = require('mongoose');

var floorplanSchema = mongoose.Schema({
	number: Number,
	description: String,
	image: { 
		data: Buffer, 
		contentType: String 
	}
});

module.exports = mongoose.model('Floorplan', floorplanSchema);
