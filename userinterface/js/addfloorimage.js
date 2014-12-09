$(document).ready(function() {
	$(document).on('click', '#formSubmit', function (event) {
		var buildingID = $('#building_id_holder').html();

	    var files = $('#image')[0].files;
	    console.log('files:');
	    console.log(files);

		var reader = new FileReader();
		reader.onload = function(event) {
		    var contents = event.target.result; //reader.result;
            //console.log(event.target);
		    console.log(contents);
			
			$.ajax({
				url: '/buildings/floorplan/' + buildingID,
				type: 'POST',
				data: {
					image: contents,
					number: $('#number').val(),
					description: $('#description').val()
				},
				success: function () {
					console.log('successful upload')
				}
			});
		};

		reader.onerror = function(event) {
		    console.error("File could not be read. Error code " + event.target.error.code);
		};

		reader.readAsDataURL(files[0]);

	});
});
