
var map_on = true;

//var main = document.getElementById("main");

VIZ.draw_map = function (elem){
    console.log("drawing");
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
    $('#main').width('500em').css(
                                {'background-color': 'white',
                                 'border-color': 'black',
                                 'border-width': '10px',
                                 'border-style': 'solid'});
    console.log('sepciall');
}, 4000)