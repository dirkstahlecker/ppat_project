function showFloor(buildingID, updateFloor, numFloors){
	console.log('in showFloor');
	//newImageSource = "../userinterface/img/fultonhall/" + updateFloor +".jpg";
	//document.getElementById("floorImage").src = newImageSource;

	//hide all text
	hideAllText(numFloors, buildingID);

	//show the relevant text
	newTextID = "#floorText_floor" + buildingID + updateFloor;
	$(newTextID).removeClass('hidden');
	$(newTextID).addClass('show');
}

function hideAllText(numFloors, buildingID){
	console.log('hiding all text');
	for (i = 0; i < numFloors; i++) {
		newID = "#floorText_floor" + buildingID + String(i);
		$(newID).removeClass('show');
		$(newID).addClass('hidden');
	}
}



function addFlag(map, flag) {
	console.log('in addFlag');
	//console.log(flag);
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
		//contentType: "application/json",
		data: {
			title: flag.title,
			image: flag.image,
			url: '/views/flag.ejs',
			description: flag.description
		},
		success: function(html) {
			var content = html.html;
			console.log('rendered html for alert:');
			console.log(content);

			function addInfoWindow(marker,contentString){
				var flagWindow = new google.maps.InfoWindow({
					content: contentString
				});
				google.maps.event.addListener(marker, 'click', function(){
					windowUp = true;
					map: map
					flagWindow.setPosition(event.latLng);
					flagWindow.open(map,marker);
				});
			}

			var flagWindow = new google.maps.InfoWindow({
				content: content
			});
			google.maps.event.addListener(marker, 'click', function(){
				windowUp = true;
				map: map
				flagWindow.setPosition(event.latLng);
				flagWindow.open(map,marker);
			});
			addInfoWindow(loc,content);

			windowUp = false;

			//if a window (either flag, or a building flag) is open and click map, close the infowindow
			google.maps.event.addListener(map, 'click', function (event){
				if (windowUp == true){
					flagWindow.close();
				}
			});
		}
	});

}


function addAlerts(map) {
	console.log('in addAlerts');
	console.log(map.getBounds());

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
			console.log('flags returned: ');
			console.log(flags);
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
	console.log('in addBuilding');

	//var lat = building.latitude;
	//var lon = building.longitude;
	//var coords = new google.maps.LatLng(lat, lon);

	var paths = makePaths(building.points);

	//building shape
	var buildingShape = new google.maps.Polygon({
		map: map,
		paths: paths,
		strokeColor: '#ff0000', //TODO: make these into variables
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
			console.log('returned html: ');
			//console.log(html.html);
			var modalArea = document.getElementById('modals_area');
			//console.log('inner html: ');
			//console.log(modalArea.innerHTML);
			modalArea.innerHTML += html.html;
			//create anonymous function to be the event listener
			google.maps.event.addListener(buildingShape, 'click', function (event) { 
				console.log("EVENT LISTENER WAS CALLED: " + building.name);
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
	console.log('in buildGUI');
	var zoom = 19;
	var mapCanvas = document.getElementById('map_canvas');

	var mapOptions = {
		center: new google.maps.LatLng(42.334488, -71.1701876), //TODO: make this dynamic
		zoom: zoom,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	var map = new google.maps.Map(mapCanvas, mapOptions);
	
	makeKey(map);

	//populate flags, whenever scrolling changes
	google.maps.event.addListener(map, 'bounds_changed', function() {
		addAlerts(map);
	});

	$.ajax({
		url: '/buildings',
		method: 'GET',
		data: {},
		success: function(data) {
			//data contains all buildings
			for (var i = 0; i < data.documents.length; i++) { //TODO: this is wrong
				var building = data.documents[i];
				console.log('building from client: ');
				console.log(building);
				addBuilding(building, map);
			}
		}
	});
}



function makeKey(map) {
	//MADE A KEY
	// //need to make dynamic..
	var key = $('#key');
	console.log('key: ');
	console.log(key);
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('key'));

	//consider doing this so screen resizing issues go away???
	// map.controls[google.maps.ControlPosition.TOP].push(document.getElementById('topBar'));

	key.append('<div>');
	key.append('<img src= "../testImagePhoebe/caution.png" height = "30" width = "30"> Caution<br />');
	key.append('<img src= "../testImagePhoebe/wheelchair.jpg" height = "35" width = "35"> Accessible Entrance<br />');
	key.append('<img src= "../testImagePhoebe/elevatorIcon.png" height = "40" width = "40"> Elevator<br />');
	key.append('</div>');
	/*
	//on double click, creates a marker
	google.maps.event.addListener(map, 'dblclick', function(event) {
		var addPin = new google.maps.Marker({
			map: map,
			position: event.latLng,
			draggable: true,
			animation: google.maps.Animation.DROP,
			title: "Alert",
			icon: potholeCaution //change to specific picture? or should pin be added through a form??
		  });

		//GET RID OF BLUE HIGHLIGHT
		var contentString = $('<div class = "pin_info">'+ 
			'<div class = "inner"> Watch out here! </div>'
			+ '<button class = "remove" title= "Remove"> Remove</button></div>');


		var infoWindow = new google.maps.InfoWindow();
		infoWindow.setContent(contentString[0]);
		google.maps.event.addListener(addPin, 'click', function(){
			infoWindow.open(map,addPin);
		});

		var removePin =contentString.find('button.remove')[0];
		google.maps.event.addDomListener(removePin, "click", function(event){
			addPin.setMap(null);
		});
	});
	*/
}



//google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'load', buildGUI);
