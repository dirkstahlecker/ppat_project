var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buildingSchema = mongoose.Schema({
	name: String,
	floorplans: [{type: Schema.Types.ObjectId, ref: 'Floorplan'}],
	latitude: Number,
	longitude: Number,
	points: [Number]
});


module.exports = mongoose.model('Building', buildingSchema);