var mongoose = require('mongoose');

var flagSchema = mongoose.Schema({
	title: String,
	color: String,
	icon: String,
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