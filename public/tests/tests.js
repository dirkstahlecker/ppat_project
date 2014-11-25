//requires a document in the database that fits the description

QUnit.asyncTest("testing adding floorplans to a building", function(assert) {
	var buildingID = "5473e345b54ffb5ff4cd5c55";
	$.ajax({
		type: "POST",
		url: '/buildings/floorplan/' + buildingID,
		data : {
			number: 1,
			description: 'This is a description of the first floor',
			image: '/users/dirk/downloads/jeffgordon.jpg'
		},
		success: function(obj) {
			console.log(obj);
			ok(obj.building != null);
			QUnit.start();
		}
	}); 	
});



/*QUnit.asyncTest("testing flags", function(assert){
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
});*/
/*
QUnit.asyncTest("testing buildings", function(assert){
	var id = "5459a7d60b939c4f971a8af0";

	$.ajax({
		type: "GET",
		url: '/buildings/' + id,
		data : {},
		success: function(obj) {
			var res = JSON.parse(obj);
			console.log(res);

			assert.equal(res.documents.name, "fulton");
			QUnit.start();
		}
	}); 
});*/
/*
QUnit.asyncTest("testing buildings with floors", function(assert){
	var id = "546d6c49510934eb9e5bf3fd"; //building id
	var floor = '1';

	$.ajax({
		type: "GET",
		url: '/buildings/' + id + '/' + floor,
		data : {},
		success: function(obj) {
			var res = JSON.parse(obj);
			console.log(res);

			assert.equal(res.documents.name, "fulton");
			QUnit.start();
		}
	}); 
});*/

/*
QUnit.asyncTest("testing flags", function(assert){
	//create user so we can log in
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
*/