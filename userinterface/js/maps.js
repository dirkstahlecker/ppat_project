

            //PHOEBE ADDED THIS
            disableDoubleClickZoom: true,
            //END PHOEBE ADDED THIS



//POST-MERGE EDIT:
//PHOEBE ADDING ACTUAL LOCATIONS OF ACCESSIBLE ENTRANCES
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

//instantiating door symbol
// var wheelchairDoor = {
//   url: '../testImagePhoebe/wheelchair.jpg',
//   scaledSize: new google.maps.Size(25,25)
// };
// //instantiating pothole caution symbol
// var potholeCaution = {
//   url: '../testImagePhoebe/caution.png',
//   scaledSize:new google.maps.Size(30,25)
// }

// var elevatorCaution = {
//   url: '../testImagePhoebe/elevatorIcon.png',
//   scaledSize: new google.maps.Size(40,40)
// }



//PHOEBE ADDED THIS: ZOOM LISTENER TO DEAL WITH FLAG SIZES
// google.maps.event.addListener(map,'zoom_changed', function(){
//   var zoom = map.getZoom();
//   for (i = 0; i< markerArray.length; i++){
//     if (zoom <19 || zoom >20){
//       markerArray[i].setMap(null);
//     }else{
//       markerArray[i].setMap(map);
//     }
// }
// });



//POST MERGE CHANGES-> PHOEBE:::::::::::::::::::::::::::


// map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(key);

//consider doing this so screen resizing issues go away???
// map.controls[google.maps.ControlPosition.TOP].push(document.getElementById('topBar'));



