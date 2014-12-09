$(document).ready(function() {
    $(document).on('click', '#formSubmit', function (event) {
        var buildingID = $('#building_id_holder').html();
        var files = $('#image')[0].files;

        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var contents = event.target.result;
                
                $.ajax({
                    url: '/buildings/floorplan/' + buildingID,
                    type: 'PUT',
                    data: {
                        image: contents,
                        number: $('#number').val(),
                        description: $('#description').val()
                    },
                    success: function () {
                        console.log('successful upload');
                        window.location.replace('/'); //force redirect back home
                    }
                });
            };

            reader.onerror = function(event) {
                console.error("File could not be read. Error code " + event.target.error.code);
            };

            reader.readAsDataURL(files[0]);          
        }
        else { //no image to upload
            $.ajax({
                url: '/buildings/floorplan/' + buildingID,
                type: 'PUT',
                data: {
                    image: '',
                    number: $('#number').val(),
                    description: $('#description').val()
                },
                success: function () {
                    console.log('successful upload');
                    window.location.replace('/'); //force redirect back home
                }
            });
        }
    });
});
