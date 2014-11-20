//************ ARTHI'S FUNCTIONS ************//

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

  for  (i=0; i<textIDs.length; i++) {
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
}








//*********** PHOEBE'S FUNCTIONS ************//

// Boston College all-campus coordinates:
          // center: new google.maps.LatLng(42.3352078, -71.1699536),
           // zoom: 16,
//center position: Stokes Hall
      stokesCoords = new google.maps.LatLng(42.334104, -71.171338);
      function initialize() {
        var mapCanvas = document.getElementById('map_canvas');
        var mapOptions = {

            disableDoubleClickZoom: true,
            center: stokesCoords,
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


}
      google.maps.event.addDomListener(window, 'load', initialize);