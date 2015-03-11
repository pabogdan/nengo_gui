VIZ.zoom_disabled = false;

VIZ.zoom = function (e) {
	if (!VIZ.zoom_disabled) {
		var mapped_area = document.getElementById('main');
		//console.log(mapped_area.width);
		var elements = VIZ.shown_components
	    var scroll_speed = 10;
	    var movement = (event.deltaY / 53) * scroll_speed;
		//VIZ.on_main_resize(50, 20);


		console.log(elements[0].div.getBoundingClientRect());




		/*var isOutside = $(".graph").outerHeight(true) > $(mapped_area).height() ||
				 $(".graph").outerWidth(true) > $(mapped_area).width();

-				 console.log(isOutside);*/
	}
}

VIZ.on_main_resize = function (width, height){
	$('#main')
		.attr('height', height)
		.attr('width', width)
		.height(height + 'em')
		.width(width + 'em');
	VIZ.draw_map()
}
