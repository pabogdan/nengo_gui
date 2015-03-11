
var map_on = true;

//var main = document.getElementById("main");

VIZ.find_aoc = function() {
    var all = $('#main').find('.graph');
    console.log(all[0]);
    var x_min;
    var x_max;
    var y_min;
    var y_max;
    for (var i = all.length - 1; i >= 0; i--) {
        var x_pos = $(all[i]).attr('data-x');
    };
}



VIZ.draw_map = function (elem){
    $('.minimap').remove();
    $('.miniregion').remove();
    if (map_on){
        VIZ.map = $('#main').minimap({
            heightRatio : 0.05,
            widthRatio : 0.2,
            offsetHeightRatio : 0.65,
            offsetWidthRatio : 0.035,
            position : "right",
            touch: true,
            smoothScroll: true,
            smoothScrollDelay: 200,
            onPreviewChange: function() {}
        });
    }
    $('.miniregion').remove();
}
VIZ.draw_map();
setInterval(function(){VIZ.draw_map()}, 1000);

setTimeout(function(){
    $('#main').css(
        {'background-color': 'white',
         'border-color': 'black',
         'border-width': '10px',
         'border-style': 'solid'});
    var mapped_area = document.getElementById('main');
    mapped_area.width = mapped_area.offsetWidth;
    mapped_area.height = mapped_area.offsetHeight;
}, 0)