var control = document.getElementById("fileInput");
control.addEventListener("change", function(event) {
    // When the control has changed, there are new files
    var files = control.files;

	var reader = new FileReader();
	reader.onload = function(event) {
	    var contents = event.target.result;
		
		$.ajax({
			url: '/image/upload',
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

	reader.readAsText(control.files[0]);

}, false);