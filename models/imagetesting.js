var mongoose = require('mongoose');

var imgTestingSchema = mongoose.Schema({
	name: String,
	image: { data: Buffer, contentType: String }
});

//image example code taken from here: https://gist.github.com/aheckmann/2408370


module.exports = mongoose.model('ImageTesting', imgTestingSchema);