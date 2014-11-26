function getFirstPart() {
	return '<!-- Fulton Modal -->\
<!-- Building Modal -->\
<div class="modal fade" id="myBuildingModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
  <div class="modal-dialog">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
        <h4 class="modal-title" id="myModalLabel">';
}

function getSecondPart() {
	return '</h4>\
      </div>\
      <div class="modal-body">\
    <table class="table">\
        <tbody>\
          <tr>\
          <td>\
           <ul class="nav nav-pills nav-stacked" role="tablist">';
}

function getThirdPart() {
	return '</tr>\
        </tbody>\
      </table>\
\
\
\
<!-- Detailed Descriptions of Floor Plans -->\
    <table class="table">\
        <tbody>';
}