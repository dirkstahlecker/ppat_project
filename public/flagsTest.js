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
