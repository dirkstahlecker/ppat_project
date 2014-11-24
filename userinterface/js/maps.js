

//************ ARTHI'S FUNCTIONS ************//
/*
function showFloor(updateFloor){
  newImageSource = "../userinterface/img/fultonhall/" + updateFloor +".jpg";
  document.getElementById("fultonFloorImage").src = newImageSource;

  //hide all text
  hideAllText();

  //show the relevant text
  newTextID = "#fultonFloorText_" + updateFloor;
  $(newTextID).removeClass('hidden');
  $(newTextID).addClass('show');
}

function hideAllText(){
  textIDs = ['floorSummaries', 'floor1', 'floor2', 'floor3', 'floor4']

  for (i=0; i<textIDs.length; i++) {
    newID = "#fultonFloorText_" + textIDs[i];
    $(newID).removeClass('show');
    $(newID).addClass('hidden');
  }
}

// $(".nav-tabs").find("a").click(function(){
//     $(".nav-tabs").find("a").removeClass("active");
//     $(this).addClass("active");
// });


//opens modal with Fulton Floor plans and details:
function showFultonModal(event){
  $('#myFultonModal').modal('toggle')
}


//opens modal with Fulton Floor plans and details:
function showStokesModal(event){
  $('#myFultonModal').modal('toggle')
}*/


//***************************************************************************************************//
//*************************************** DIRK ******************************************************//
//***************************************************************************************************//



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

/*
	//doorLocations = [new google.maps.LatLng(42.334294,-71.169987), new google.maps.LatLng(42.334635,-71.169783)];

	//instantiating door symbol
	var wheelchairDoor = {
		url: 'img/testImagePhoebe/wheelchair.jpg',
		scaledSize: new google.maps.Size(25,25)
	};
	//instantiating pothole caution symbol
	var potholeCaution = {
		url: 'img/testImagePhoebe/caution.png',
		scaledSize:new google.maps.Size(30,25)
	}

	//adding markers
	markerArray = [];
	function addMarkers(array, iconType){
		for (i = 0; i < array.length; i++){
			var marker = new google.maps.Marker({
				position: array[i],
				icon: iconType,
				map: map,
				draggable: false
			});
			markerArray.push(marker);
		}
	}

	//index 0
	addMarkers(potholeLocations, potholeCaution);
	//indices 1-2
	addMarkers(doorLocations, wheelchairDoor);

	console.log('marker array: ');
	console.log(markerArray);

	//TODO: make this not ugly
	//html content for each  marker popup
	content = ['<div id="content"> <div id="siteNotice"></div>'+
		'<h1 id="firstHeading" class="firstHeading">Pothole</h1>'+
		'<div id="bodyContent">'+
		'<p><b><img src = "../testImagePhoebe/pothole.jpg" height = "100" width = "100"></b>, lalalalalal <p>Testing stuff</p>' +
		'wooooooo sample text!!!</div>',

		'<div id="content"><div id="siteNotice"></div>'+
		'<h1 id="firstHeading" class="firstHeading">Front Door</h1>'+
		'<div id="bodyContent">'+
		'<p><b><img src = "../testImagePhoebe/fultonHall.jpg" height = "250" width = "300"></b>, lalalalalal <p>Testing stuff</p>' +
		'wooooooo sample text!!!</div>',

		'<div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">Front Door</h1>'+
		'<div id="bodyContent">'+
		'<p><b><img src = "../testImagePhoebe/fultonHall.jpg" height = "250" width = "300"></b> lalalalalal <p>Testing stuff</p>' +
		'wooooooo sample text!!!'+
		'</div>'
	];

	//boolean: if a window is up, clicking on the map gets rid of it
	var windowUp = false;
	//all pop up windows
	windows = [];

	//makes sure each marker has different content and different click responses
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
		windows.push(flagWindow);
	}

	//calls addInfoWindow for each marker
	for (i = 0; i< markerArray.length; i++){

		addInfoWindow(markerArray[i],content[i]);
	}

	console.log('windows: ');
	console.log(windows);

	//pop up window when click building
	//var insideBuilding = new google.maps.InfoWindow(); //TODO: deleted this - should I have?

	//if a window (either flag, or a building flag) is open and click map, close the infowindow
	google.maps.event.addListener(map, 'click', function (event){
		if (windowUp == true){
			for (i=0; i<windows.length; i++){
				windows[i].close();
			}
		}
	});

}*/

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
	/*
	$.ajax({
		url: '/image',
		method: 'GET',
		data: {},
		success: function(data) {
			console.log('successfully stored image (?)');
		}
	});
	*/


	console.log('in buildGUI');
	var zoom = 19;
	var mapCanvas = document.getElementById('map_canvas');

	var mapOptions = {
		center: new google.maps.LatLng(42.334488, -71.1701876), //TODO: make this dynamic
		zoom: zoom,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	var map = new google.maps.Map(mapCanvas, mapOptions);
	
	//populate flags, whenever scrolling changes
	google.maps.event.addListener(map, 'bounds_changed', function() {
		addAlerts(map);
	});

	//addAlerts(map);
	//addBuilding({latitude: 42.334488, longitude: -71.1701876}, mapCanvas);
	
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



















//*********** PHOEBE'S FUNCTIONS ************//

// Boston College all-campus coordinates:
          // center: new google.maps.LatLng(42.3352078, -71.1699536),
           // zoom: 16,
//center position: Fulton Hall
	  

function initialize() { //this is called on load
	fultonCoords = new google.maps.LatLng(42.334488, -71.1701876);
        var mapCanvas = document.getElementById('map_canvas');
        var mapOptions = {

            center: fultonCoords,
            zoom:19,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var map = new google.maps.Map(mapCanvas, mapOptions)

//Shape of Fulton Hall Building
        var fultonShape = new google.maps.Polygon({
          map: map,
          paths: [
            new google.maps.LatLng(42.334553,-71.170432),
            new google.maps.LatLng(42.334319,-71.170346),
            new google.maps.LatLng(42.334309,-71.170389),
            new google.maps.LatLng(42.334247,-71.170368),
            new google.maps.LatLng(42.334245,-71.170335),
            new google.maps.LatLng(42.334223,-71.170319),
            new google.maps.LatLng(42.334220,-71.170290),
            new google.maps.LatLng(42.334247,-71.170193),
            new google.maps.LatLng(42.334336,-71.169791),
            new google.maps.LatLng(42.334323,-71.169751),
            new google.maps.LatLng(42.334348,-71.169673),
            new google.maps.LatLng(42.334374,-71.169649),
            new google.maps.LatLng(42.334444,-71.169670),
            new google.maps.LatLng(42.334444,-71.169713),
            new google.maps.LatLng(42.334672,-71.169812),
            new google.maps.LatLng(42.334668,-71.169845),
            new google.maps.LatLng(42.334800,-71.169898),
            new google.maps.LatLng(42.334791,-71.169981),
            new google.maps.LatLng(42.334749,-71.169971),
            new google.maps.LatLng(42.334749,-71.170016),
            new google.maps.LatLng(42.334707,-71.170011),
            new google.maps.LatLng(42.334656,-71.170263),
            new google.maps.LatLng(42.334685,-71.170282),
            new google.maps.LatLng(42.334685,-71.170325),
            new google.maps.LatLng(42.334713,-71.170346),
            new google.maps.LatLng(42.334695,-71.170432),
            new google.maps.LatLng(42.334570,-71.170402)
          ],
          strokeColor: '#ff0000',
          strokeOpacity: 0.8,
          strokeWeight:2,
          fillOpacity: 0
        });

//shape of stokes hall
        var stokesShape = new google.maps.Polygon({
          map: map,
          paths: [
            new google.maps.LatLng(42.334324,-71.171325),
            new google.maps.LatLng(42.334348,-71.171325),
            new google.maps.LatLng(42.334376,-71.171207),
            new google.maps.LatLng(42.334362,-71.171199),
            new google.maps.LatLng(42.334362,-71.171164),
            new google.maps.LatLng(42.334274,-71.171127),
            new google.maps.LatLng(42.334263,-71.171156),
            new google.maps.LatLng(42.334005,-71.171065),
            new google.maps.LatLng(42.334009,-71.171035),
            new google.maps.LatLng(42.333914,-71.170993),
            new google.maps.LatLng(42.333902,-71.171044),
            new google.maps.LatLng(42.333824,-71.171019),
            new google.maps.LatLng(42.333777,-71.171237),
            new google.maps.LatLng(42.333757,-71.171242),
            new google.maps.LatLng(42.333733,-71.171363),
            new google.maps.LatLng(42.333888,-71.171430),
            new google.maps.LatLng(42.333864,-71.171542),
            new google.maps.LatLng(42.334112,-71.171623),
            new google.maps.LatLng(42.334112,-71.171655),
            new google.maps.LatLng(42.334191,-71.171674),
            new google.maps.LatLng(42.334195,-71.171609),
            new google.maps.LatLng(42.334272,-71.171626)

          ],
          strokeColor: '#ff0000',
          strokeOpacity: 0.8,
          strokeWeight:2,
          fillOpacity: 0
        });

//event listener when click stokes shape
//WILL CLEAN THIS UP LATER
google.maps.event.addListener(stokesShape, 'click', showStokesModal);
//color changes when mousing over the building
google.maps.event.addListener(stokesShape, 'mouseover', function (event){
  this.setOptions({
    strokeColor: '#ff0000',
    fillColor: '#ff0000',
    fillOpacity: 0.5
  });
});

//removes color when mouse out of the building
google.maps.event.addListener(stokesShape, 'mouseout', function (event){
  this.setOptions({
    strokeColor: '#ff0000',
    fillOpacity: 0
  });
  
});

//end stokes stuff

//event listener when click shape
google.maps.event.addListener(fultonShape, 'click', showFultonModal);

//pop up window when click building
insideBuilding = new google.maps.InfoWindow();

//boolean: if a window is up, clicking on the map gets rid of it
var windowUp = false;

// //loads contents of popup window; opens up the popup window 
// function showFloors(event){
//   windowUp = true;
//   map: map
//   var contentString = '<div id="content">'+
//       '<div id="siteNotice">'+
//       '</div>'+
//       '<h1 id="firstHeading" class="firstHeading">First Floor</h1>'+
//       '<div id="bodyContent">'+
//       '<p><b>Insert Floorplan here</b>, lalalalalal <p>Testing stuff</p>' +
//       'wooooooo sample text!!!'+
//       '</div> <img src = "../testImagePhoebe/phoebePicTest.jpg" height = "500" width = "500">'
//       +'</div>';
//   insideBuilding.setContent(contentString);
//   insideBuilding.setPosition(fultonCoords);
//   insideBuilding.open(map);
//   windows.push(insideBuilding);
// }

//color changes when mousing over the building
google.maps.event.addListener(fultonShape, 'mouseover', function (event){
  this.setOptions({
    strokeColor: '#ff0000',
    fillColor: '#ff0000',
    fillOpacity: 0.5
  });
});

//removes color when mouse out of the building
google.maps.event.addListener(fultonShape, 'mouseout', function (event){
  this.setOptions({
    strokeColor: '#ff0000',
    fillOpacity: 0
  });
  
});

//all pop up windows
windows = [];
//if a window (either flag, or a building flag) is open and click map, close the infowindow
  google.maps.event.addListener(map, 'click', function (event){
      if (windowUp == true){
        for (i=0; i<windows.length; i++){
          windows[i].close();
        }
      }
  });

potholeLocations = [new google.maps.LatLng(42.334379,-71.169555)];
doorLocations = [new google.maps.LatLng(42.334294,-71.169987), new google.maps.LatLng(42.334635,-71.169783)];

//instantiating door symbol
var wheelchairDoor = {
  url: '../testImagePhoebe/wheelchair.jpg',
  scaledSize: new google.maps.Size(25,25)
};
//instantiating pothole caution symbol
var potholeCaution = {
  url: '../testImagePhoebe/caution.png',
  scaledSize:new google.maps.Size(30,25)
}

//adding markers
markerArray = [];
function addMarkers(array, iconType){
  for (i = 0; i < array.length; i++){
    var marker = new google.maps.Marker({
      position: array[i],
      icon: iconType,
      map: map,
      draggable: false
    })
    markerArray.push(marker);
  }
}

//index 0
addMarkers(potholeLocations, potholeCaution);
//indices 1-2
addMarkers(doorLocations, wheelchairDoor);


//html content for each  marker popup
content = ['<div id="content"> <div id="siteNotice"></div>'+
      '<h1 id="firstHeading" class="firstHeading">Pothole</h1>'+
      '<div id="bodyContent">'+
      '<p><b><img src = "../testImagePhoebe/pothole.jpg" height = "100" width = "100"></b>, lalalalalal <p>Testing stuff</p>' +
      'wooooooo sample text!!!</div>',

      '<div id="content"><div id="siteNotice"></div>'+
      '<h1 id="firstHeading" class="firstHeading">Front Door</h1>'+
      '<div id="bodyContent">'+
      '<p><b><img src = "../testImagePhoebe/fultonHall.jpg" height = "250" width = "300"></b>, lalalalalal <p>Testing stuff</p>' +
      'wooooooo sample text!!!</div>',

      '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Front Door</h1>'+
      '<div id="bodyContent">'+
      '<p><b><img src = "../testImagePhoebe/fultonHall.jpg" height = "250" width = "300"></b> lalalalalal <p>Testing stuff</p>' +
      'wooooooo sample text!!!'+
      '</div>'
      ];


//makes sure each marker has different content and different click responses
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
  windows.push(flagWindow);
}

//calls addInfoWindow for each marker
for (i = 0; i< markerArray.length; i++){
  addInfoWindow(markerArray[i],content[i]);
}

}
//google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, 'load', buildGUI);