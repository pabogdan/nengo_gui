VIZ.zoom_disabled = false;

VIZ.zoom = function (e) {
	if (!VIZ.zoom_disabled) {
		var mapped_area = document.getElementById('main');
		console.log(mapped_area);
		var elements = VIZ.shown_components
	    var scroll_speed = 10;
	    var movement = (event.deltaY / 53) * scroll_speed;
		
	}
}