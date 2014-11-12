var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buildingSchema = mongoose.Schema({
	name: String,
	floorplans: [{type: Schema.Types.ObjectId, ref: 'Floorplan'}]
	//coords: [] //hotspot for clicking - future implementation
});


module.exports = mongoose.model('Building', buildingSchema);