//$(document).ready(function () {
    $(document).on("click", "#clickHere", function (e) {
		console.log('alerting');
		alert($('#fileInput').val());
	});
