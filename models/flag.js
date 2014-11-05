var mongoose = require('mongoose');

var flagSchema = mongoose.Schema({
	color: String,
	icon: { data: Buffer, contentType: String },
	description: String,
	image: { data: Buffer, contentType: String },
	latitude: Number,
	longitude: Number
});
/*
flagSchema.methods.inView = function() {
    console.log('calling Flag method inView without "statics"');
};
*/
flagSchema.statics.inView = function(latl, latr, longb, longt, callback) {
    console.log('Flag inView');

    var inView = [];
    this.find({}).sort({"end":-1}).exec(function(error, docs){
        docs.forEach(function(doc){
            var lat = parseFloat(doc.latitude);
            var lon = parseFloat(doc.longitude);

            console.log('latl: ' + latl);
            console.log('latr: ' + latr);
            console.log('lat: ' + lat);

            console.log('longb: ' + longb);
            console.log('longt: ' + longt);
            console.log('lon: ' + lon);

            latl = parseFloat(latl);
            latr = parseFloat(latr);
            longb = parseFloat(longb);
            longt = parseFloat(longt);

            if (latl <= lat && latr >= lat && longt >= lon && longb <= lon){
                console.log('PUSHING');
                inView.push(doc);
            }
        });
        callback(error, inView);
    });
};

//image example code taken from here: https://gist.github.com/aheckmann/2408370


module.exports = mongoose.model('Flag', flagSchema);