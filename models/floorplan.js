var mongoose = require('mongoose');

var floorplanSchema = mongoose.Schema({
	number: { 
        type: Number,
        unique: false
    },
	description: String,
	image: { 
		data: Buffer, 
		contentType: String 
	}
});

module.exports = mongoose.model('Floorplan', floorplanSchema);
