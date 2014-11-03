var mongoose = require('mongoose');

var flagSchema = mongoose.Schema({
	color: String,
	icon: { data: Buffer, contentType: String },
	description: String,
	image: { data: Buffer, contentType: String },
	latitude: Number,
	longitude: Number
});

flagSchema.statics.inView = function(latl, latr, longb, longt, callback) {
    var inView = [];
    this.find({}).sort({"end":-1}).exec(function(error, docs){
        docs.forEach(function(doc){
            var lat = doc.latitude;
            var lon = doc.longitude;
            if (latl < lat && latr > lat && longt>lon && longb<lon){
                inView.push(doc);
            }
        });
        callback(error, active);
    });

}

//image example code taken from here: https://gist.github.com/aheckmann/2408370


module.exports = mongoose.model('Flag', flagSchema);