//requires a document in the database that fits the description
QUnit.asyncTest("testing flags", function(assert){
	var latr = 30;
	var latl = 20;
	var longb = 20;
	var longt = 30;

	$.ajax({
		type: "GET",
		url: '/flags/' + latr + '/' + latl + '/' + longb + '/' + longt,
		data : {},
		success: function(obj) {
			var res = JSON.parse(obj);
			console.log(res);

			assert.equal(res.documents[0].color, "yellow");
			assert.equal(res.documents[0].latitude, 24);
			assert.equal(res.documents[0].longitude, 25);
			QUnit.start();
		}
	}); 
});

QUnit.asyncTest("testing buildings", function(assert){
	var id = "5459a7d60b939c4f971a8af0";

	$.ajax({
		type: "GET",
		url: '/building/' + id,
		data : {},
		success: function(obj) {
			var res = JSON.parse(obj);
			console.log(res);

			assert.equal(res.documents.name, "fulton");
			QUnit.start();
		}
	}); 
});

QUnit.asyncTest("testing buildings with floors", function(assert){
	var id = "5459a7d60b939c4f971a8af0"; //building id
	var floor = '1';

	$.ajax({
		type: "GET",
		url: '/building/' + id + '/' + floor,
		data : {},
		success: function(obj) {
			var res = JSON.parse(obj);
			console.log(res);

			assert.equal(res.documents.name, "fulton");
			QUnit.start();
		}
	}); 
});