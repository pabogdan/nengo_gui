/** namespace for all Nengo visualization */
var VIZ = {};

/**
 * Helper function to set the transform of an element.
 */
VIZ.set_transform = function(element, x, y) {
    element.style.webkitTransform = 
        element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
}

/** 
 * Base class for interactive visualization
 * @constructor
 *
 * @param {dict} args - A set of constructor arguments, including:
 * @param {DOMElement} args.parent - the element to add this component to
 * @param {float} args.x - the left side of the component (in pixels)
 * @param {float} args.y - the top of the component (in pixels)
 * @param {float} args.width - the width of the component (in pixels)
 * @param {float} args.height - the height of the component (in pixels)
 * @param {int} args.id - the id of the server-side component to connect to
 */
VIZ.Component = function(args) {
    var self = this;

    /** Create the div for the component and position it */
    this.div = document.createElement('div');
    this.div.style.width = args.width;
    this.div.style.height = args.height;
    VIZ.set_transform(this.div, args.x, args.y);
    this.div.style.position = 'fixed';
    this.div.classList.add('graph');
    args.parent.appendChild(this.div);
    this.parent = args.parent;
    

    /** Move element to be drawn on top when clicked on */
    this.div.onmousedown = function(event) {
        self.parent.removeChild(self.div);
        self.parent.appendChild(self.div);
    };
    this.div.ontouchstart = this.div.onmousedown;
    
    /** Allow element to be dragged */ 
    this.div.setAttribute('data-x', args.x);
    this.div.setAttribute('data-y', args.y);
    interact(this.div)
        .draggable({
            inertia: true,
            restrict: {
                restriction: "parent",
                endOnly: true,
                elementRect: {top: 0, left: 0, bottom: 1, right: 1 }
            },
            onmove: function (event) {
                var target = event.target;
                var x = parseFloat(target.getAttribute('data-x')) + event.dx;
                var y = parseFloat(target.getAttribute('data-y')) + event.dy;
                VIZ.set_transform(target, x, y);
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);                  
            }
        })

    /** Allow element to be resized */ 
    interact(this.div)
        .resizable(true)
        .on('resizemove', function(event) {
            var target = event.target;
            var newWidth = parseFloat(target.style.width) + event.dx;
            var newHeight = parseFloat(target.style.height) + event.dy;
            target.style.width  = newWidth + 'px';
            target.style.height = newHeight + 'px';
            self.on_resize(newWidth, newHeight);
        });    

    /** Open a WebSocket to the server */
    this.id = args.id;
    if (this.id != undefined) {
        this.ws = new WebSocket('ws://localhost:8080/viz_component?id=' + 
                                this.id);
        this.ws.binaryType = "arraybuffer";
        this.ws.onmessage = function(event) {self.on_message(event);}
    }
};

/**
 * Method to be called when Component is resized
 */
VIZ.Component.prototype.on_resize = function(width, height) {};

/**
 * Method to be called when Component received a WebSocket message
 */
VIZ.Component.prototype.on_message = function(event) {};
