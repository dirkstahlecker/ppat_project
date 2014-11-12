function showFloor(updateFloor){
  newImageSource = "../userinterface/img/fultonhall/" + updateFloor +".jpg";
  document.getElementById("fultonFloorImage").src = newImageSource;

  //hide all text
  hidealltext();

  //show the relevant text
  newTextID = "#fultonFloorText_" + updateFloor;
  $(newTextID).removeClass('hidden');
  $(newTextID).addClass('show');
}

function hidealltext(){
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