//PHOEBE EDIT: ACTUAL LOCATIONS OF ACCESSIBLE ENTRANCES
//42.334112, -71.171623
//42.333961, -71.171564
//42.333799, -71.171167
//42.334136, -71.171113
//42.334663, -71.170271
//42.334298, -71.169955
// potholeLocations = [new google.maps.LatLng(42.334379,-71.169555)];
// doorLocations = [new google.maps.LatLng(42.334112,-71.171623), 
//     new google.maps.LatLng(42.333961,-71.171564),
//     new google.maps.LatLng(42.333799,-71.171167),
//     new google.maps.LatLng(42.334136,-71.171113),
//     new google.maps.LatLng(42.334663,-71.170271),
//     new google.maps.LatLng(42.334298,-71.169955)];
// elevatorLocations = [new google.maps.LatLng(42.334151,-71.171274)];

//END PHOEBE EDIT: 




function showFloor(buildingID, updateFloor){
    $.ajax({
        url: '/buildings/populate/' + buildingID,
        type: 'GET',
        success: function (building) {
            var building = building.documents;
            var floorNums = [];
            for (var i = 0; i < building.floorplans.length; i++) {
                var floorplan = building.floorplans[i];
                floorNums.push(floorplan.number);
            }
            console.log(floorNums);

            //hide all text
            hideAllText(floorNums, buildingID);

            //show the relevant text
            newTextID = "#floorText_floor" + buildingID + updateFloor;
            newPicID = "#floorImage_floor" + buildingID + updateFloor;
            $(newTextID).removeClass('hidden');
            $(newPicID).removeClass('hidden');
            $(newTextID).addClass('show');
            $(newPicID).addClass('show');
        }
    });
}

function hideAllText(floorNums, buildingID){
    //floorNums is an array of all the floor numbers present
	for (i = 0; i < floorNums.length; i++) { //TODO: Problem here: numbers aren't sequential - need to pass in array of numbers we care about
        var num = String(floorNums[i]);
		var newID = "#floorText_floor" + buildingID + num;
		var newPicID = "#floorImage_floor" + buildingID + num;

		$(newID).removeClass('show');
		$(newID).addClass('hidden');
		$(newPicID).removeClass('show');
		$(newPicID).addClass('hidden');
	}
}


function addFlag(map, flag) {
	//TEST:
	if (flag == null) {
		return;
	}
	var loc = new google.maps.LatLng(flag.latitude, flag.longitude);
	var icon = {
		url: flag.icon,
		scaledSize: new google.maps.Size(25,25)
	};

	var marker = new google.maps.Marker({
		position: loc,
		icon: icon,
		map: map,
		draggable: false
	});

	$.ajax({
		url: '/templates/render',
		type: 'POST',
		data: {
			title: flag.title,
			image: flag.image,
			url: '/views/flag.ejs',
			description: flag.description,
			id: flag._id
		},
		success: function(html) {
			var content = html.html;
			var flagWindow = new google.maps.InfoWindow({
				content: content
			});


			google.maps.event.addListener(marker, 'click', function(){
				windowUp = true;
				map: map
				flagWindow.setPosition(event.latLng);
				flagWindow.open(map,marker);
			});

			windowUp = false;

			//if a window (either flag, or a building flag) is open and click map, close the infowindow
			google.maps.event.addListener(map, 'click', function (event){
				if (windowUp == true){
					flagWindow.close();
				}
			});

			//PHOEBE: waits for infowindow to load before setting event listener for remove button click
			google.maps.event.addListener(flagWindow, 'domready', function() {
                var removePin = $(content).contents().find('button.remove')[0];
                console.log('remove Pin: ' + $('.remove'));
                $('.remove').off('click').on('click', function(event){
                //PHOEBE: This prints okay
                    // marker.setMap(null);
                    console.log("should be deleted now..");
                    removeMarker(marker, loc);
                });
			});
		}
	});
}


function addAlerts(map) {
	var bounds = map.getBounds();
	sw = bounds.getSouthWest();
	ne = bounds.getNorthEast();

	var SWlat = sw.lat();
	var SWlng = sw.lng();
	var NElat = ne.lat();
	var NElng = ne.lng();

	$.ajax({
        url: '/flags/' + NElat + '/' + SWlat + '/' + SWlng + '/' + NElng,
        method: 'GET',
        data: {},
        success: function(flags) {
            for (var i = 0; i < flags.documents.length; i++) {
                var flag = flags.documents[i];
                addFlag(map, flag);
            }
        }
	});
}


/* Converts the list of coordinates stored in the database
 * to an actual usable array
 *
 * Parameters:
 *     points: array of numbers, alternating latitude and longitude
 *
 * Returns an array of google maps LatLng objects
 */
function makePaths(points) {
    var paths = [];
    for (var i = 0; i < points.length; i = i + 2) {
        paths.push(new google.maps.LatLng(points[i], points[i+1]));
    }
    return paths;
}


/* Add a single building
 *
 * Parameters:
 *     building: building object from the database
 *     mapCanvas: same map canvas every building is put on
 *
 * No return
 */
function addBuilding(building, map) {
    //var lat = building.latitude;
    //var lon = building.longitude;
    //var coords = new google.maps.LatLng(lat, lon);

    var paths = makePaths(building.points);

    //building shape
    var buildingShape = new google.maps.Polygon({
        map: map,
        paths: paths,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillOpacity: 0
    });

    //color changes when mousing over the building
    google.maps.event.addListener(buildingShape, 'mouseover', function (event){
        this.setOptions({
            strokeColor: '#ff0000', //TODO: make these into variables too
            fillColor: '#ff0000',
            fillOpacity: 0.5
        });
    });

    //removes color when mouse out of the building
    google.maps.event.addListener(buildingShape, 'mouseout', function (event){
        this.setOptions({
            strokeColor: '#ff0000',
            fillOpacity: 0
        });
    });

    var buildingID = building._id; //used to create unique id in DOM for building modal

    $.ajax({
        url: '/templates/renderbuilding',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
        	id: buildingID,
        	url: '/views/modal.ejs',
        }),
        success: function(html) {
        	var modalArea = $('#modals_area');
        	old_html = modalArea.html();
        	modalArea.html(old_html + html.html);

        	//create anonymous function to be the event listener
        	google.maps.event.addListener(buildingShape, 'click', function (event) { 
                $('#' + buildingID).modal('toggle');
        	});
        },
        error: function(err) {
        	console.log('ERROR in rendering EJS template');
        }
    });
}



//manages the creation of all buildings on the gui
//called when the gui is loaded
function buildGUI() {
	var zoom = 19;
	var mapCanvas = document.getElementById('map_canvas');

	var mapOptions = {
	center: new google.maps.LatLng(42.334488, -71.1701876), //TODO: make this dynamic
	zoom: zoom,
	disableDoubleClickZoom: true,
	mapTypeId: google.maps.MapTypeId.ROADMAP

	};
	var map = new google.maps.Map(mapCanvas, mapOptions);
    makeKey(map);


    //PHOEBE EDIT: THIS IS NOW A LOWER PRIORITY TASK
    var displayFlags = true;
    google.maps.event.addListener(map,'zoom_changed', function(){
      var zoom = map.getZoom();
        if (zoom <19 || zoom >20){
            displayFlags = false;
        }else{
            displayFlags = true;
        }
    });

        //populate flags, whenever scrolling changes
    google.maps.event.addListener(map, 'bounds_changed', function() {
        if (displayFlags){
            addAlerts(map);
        }else{
            //PHOEBE: once it's loaded, the flags don't go away. 
            //choices: delete from database every time zoom changes (no)
            //figure out clustering of markers as described in Maps developer article(time)
            //console.log("NO FLAGS HERE PLEASE");
        }
     });
      //END PHOEBE EDIT

	$.ajax({
		url: '/buildings',
		method: 'GET',
		data: {},
		success: function(data) {
			//data contains all buildings
			for (var i = 0; i < data.documents.length; i++) { //TODO: this is wrong
				var building = data.documents[i];
				addBuilding(building, map);
			}
		}
	});
}



function makeKey(map) {
	//MADE A KEY
	var key = $('#key');
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('key'));

	//consider doing this so screen resizing issues go away???
	// map.controls[google.maps.ControlPosition.TOP].push(document.getElementById('topBar'));

	key.append('<div>');
	key.append('<img src= "/images/caution.png" height="30" width="30"> Caution<br />');
	key.append('<img src= "/images/wheelchair.jpg" height="30" width="30"> Accessible Entrance<br />');
	key.append('<img src= "/images/elevatorIcon.png" height="30" width="30"> Elevator<br />');
	key.append('<img src= "/images/star.png" height="30" width="30"> Tip<br />');
	key.append('</div>');
	
	//on double click, creates a marker
	google.maps.event.addListener(map, 'dblclick', function(event) {
		var addPin = new google.maps.Marker({
			map: map,
			position: event.latLng,
			draggable: true,
			animation: google.maps.Animation.DROP,
			title: "Alert"
		});

		var markerForm = $('<div class = "pin_info">'+ 
			'<div class="inner"><strong> Add Pin Here </strong></div>'+
			'<form action="createMarker" method="post"><label for="details">Details*</label><br />' +
			'<input type="text" name="details" class="save_details"><br />' +
			'<label for="image">Image</label><br />' +
			'<input type="file" name="flagImage" id="flagImage" class="images" /><br /><br />' +
			'<label for="type">Type:<select name="type" class="save_type">' +
			'<option value="door">Accessible Door</option>'+
			'<option value="pothole">Pothole</option>'+
			'<option value="obstacle">Obstacle</option>' +
			'<option value="elevator">Elevator</option>'+
			'<option value="tip">Tip</option></select></label>' +
			'</form><br />' +
			'<button name="save" class="save">Save Flag</button>' +
			'<button class="remove" title= "Remove">Remove</button></div>');

		var infoWindow = new google.maps.InfoWindow();
		infoWindow.setContent(markerForm[0]);

    	infoWindow.open(map,addPin); //open window immediately

		google.maps.event.addListener(addPin, 'click', function(){
			infoWindow.open(map,addPin);
		});

		var removePin = markerForm.find('button.remove')[0];
		google.maps.event.addDomListener(removePin, "click", function(event){
			addPin.setMap(null); 
			var replace = markerForm.find('input.save_details')[0].value;
			var coords = addPin.position;
			removeMarker(removePin);
		});

		var savePin = markerForm.find('button.save')[0];
		google.maps.event.addDomListener(savePin, "click", function(event){
			var details = markerForm.find('input.save_details')[0].value;
			var type = markerForm.find('select.save_type')[0].value;
			var coords = addPin.position;

            var files = $('#flagImage')[0].files;
            console.log('files:');
            console.log(files);

			//var image = markerForm.find('input.images')[0].value;//got rid of .[0] -> [0]
			saveMarker(savePin, details, type, coords, files); //got rid of image parameter.. not being used yet in saveMarker

			//clear the old pin
			infoWindow.close();
			addPin.setMap(null);
			//show newly created alert
			addAlerts(map);
		});
	});
}


function saveMarker(Pin, replace, type, coords, files) {
	var date = new Date();
	var month = date.getMonth() + 1;
	var timeStamp = month.toString() + '-' + date.getDate().toString() + '-'+date.getFullYear().toString();
	replace = replace + "<p> <br />" + timeStamp;

	var coords = coords; //get marker position
	// console.log(coords.B);   //k = long, B = lat
	var flagData = {description: replace, latitude:coords.k, longitude: coords.D}; //post variables

	var icon, title;
	if (type == "door") {
		icon = '/images/wheelchair.jpg';
		title = 'Accessible Door';
	}
	else if (type == "pothole") {
		icon = '/images/caution.png';
		title = "Pothole";
	}
	else if (type == "obstacle") {
		icon = '/images/caution.png';
		title = "Obstacle";
	}
	else if(type == "tip"){
		icon = '/images/star.png';
		title = "Tip";
	}
	else {
		icon = '/images/elevatorIcon.png';
		title = "Elevator";
	}
	flagData.icon = icon;
	flagData.title = title;

    if (files.length > 0) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            flagData.image = contents;

            $.ajax({
                type: "POST",
                url: '/flags',
                data: flagData,
                success: function (data) {
                    replace.html = data; //replace infowindow with new html
                    //Pin.setDraggable(false); 
                    //Pin.setIcon(icon); 
                },
                error:function (xhr) {
                  alert(thrownError); //TODO: what to do here?
                }
            });
        };

        reader.onerror = function(event) {
            console.error("File could not be read. Error code " + event.target.error.code);
        };

        reader.readAsDataURL(files[0]);  
    }
    else {
        console.log('no image');
        $.ajax({
            type: "POST",
            url: '/flags',
            data: flagData,
            success:function(data){
                replace.html = data; //replace infowindow with new html
                //Pin.setDraggable(false); 
                //Pin.setIcon(icon); 
            },
            error:function (xhr){
              alert(thrownError); //TODO: what to do here?
            }
        });
    }

}

function removeMarker(Pin, coords)
{
	$.ajax({
		url: '/flags/' + coords.k + '/' + coords.D,
		type: 'GET',
		success: function(flag) {
			//if pin is not in database yet, just remove from UI

			// var position = coords; //get marker position
			// var data = {del : 'true'}//, latlang : coords}; //post variables
			// console.log($(this));
			$.ajax({
				//with just /flags, 404 error. when hard code marker's id from
				//database, 500 error....
				url: '/flags/' + flag._id,
				type: "DELETE",
				success: function(data){
					Pin.setMap(null); 
					window.location.reload();
					console.log('successfully removed from database');
				},
				error: function (xhr, status, err){
					console.log(err);
				}
			});
		},
		error: function(err) {

		}

	});
}



/*
var fultonPoints = [
  42.334553,-71.170432,
  42.334319,-71.170346,
  42.334309,-71.170389,
  42.334247,-71.170368,
  42.334245,-71.170335,
  42.334223,-71.170319,
  42.334220,-71.170290,
  42.334247,-71.170193,
  42.334336,-71.169791,
  42.334323,-71.169751,
  42.334348,-71.169673,
  42.334374,-71.169649,
  42.334444,-71.169670,
  42.334444,-71.169713,
  42.334672,-71.169812,
  42.334668,-71.169845,
  42.334800,-71.169898,
  42.334791,-71.169981,
  42.334749,-71.169971,
  42.334749,-71.170016,
  42.334707,-71.170011,
  42.334656,-71.170263,
  42.334685,-71.170282,
  42.334685,-71.170325,
  42.334713,-71.170346,
  42.334695,-71.170432,
  42.334570,-71.170402
];

function populateDatabase() {
  console.log('in populateDatabase');
  $.ajax({
    url: '/buildings',
    method: 'POST',
    data: {
      name: "Fulton Hall",
      latitude: 42.334488,
      longitude: -71.170188,
      points: fultonPoints.toString(),
      floorplans: []
    },
    success: function(data) {
      console.log('added Fulton Hall');
        $.ajax({
        url: '/buildings',
        method: 'GET',
        data: {},
        success: function(data) {
          console.log(data);
        }
      });
    },
    error: function(err) {
      console.log('error in populateDatabase call');
      console.log(err);
    }
  });
}*/


google.maps.event.addDomListener(window, 'load', buildGUI);
