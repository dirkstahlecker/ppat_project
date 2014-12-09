var mongoose = require('mongoose');

var flagSchema = mongoose.Schema({
	title: String,
	icon: String,
	description: String,
	image: String,
	latitude: Number,
	longitude: Number
});

flagSchema.statics.inView = function(latl, latr, longb, longt, callback) {
    var inView = [];
    this.find({}).sort({"end":-1}).exec(function(error, docs){
        docs.forEach(function(doc){
            var lat = parseFloat(doc.latitude);
            var lon = parseFloat(doc.longitude);

            //need to make sure everything is actually a number for comparison
            latl = parseFloat(latl);
            latr = parseFloat(latr);
            longb = parseFloat(longb);
            longt = parseFloat(longt);

            if (latl <= lat && latr >= lat && longt >= lon && longb <= lon){
                inView.push(doc);
            }
        });
        callback(error, inView);
    });
};

//image example code taken from here: https://gist.github.com/aheckmann/2408370


module.exports = mongoose.model('Flag', flagSchema);