$(document).ready(function() {
	$(document).on('click', '#formSubmit', function (event) {
		var buildingID = $('#building_id_holder').html();
		var floorNum = $('#number').val();

	    var files = $('#image')[0].files;
	    console.log('files:');
	    console.log(files);

		var reader = new FileReader();
		reader.onload = function(event) {
		    var contents = event.target.result;
			
			$.ajax({
				url: '/building/floorplan/image/' + buildingID + '/' + floorNum,
				type: 'POST',
				data: {
					image: contents
				},
				success: function () {
					console.log('successful upload')
				}
			});
		};

		reader.onerror = function(event) {
		    console.error("File could not be read. Error code " + event.target.error.code);
		};

		reader.readAsText(files[0]);

	});
});