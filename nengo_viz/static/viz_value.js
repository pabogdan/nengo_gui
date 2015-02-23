/**
 * Line graph showing decoded values over time
 * @constructor
 *
 * @param {dict} args - A set of constructor arguments (see VIZ.Component)
 * @param {int} args.n_lines - number of decoded values
 * @param {float} args.miny - minimum value on y-axis
 * @param {float} args.maxy - maximum value on y-axis
 * @param {VIZ.SimControl} args.sim - the simulation controller
 */
 
VIZ.Value = function(args) {
    VIZ.Component.call(this, args);
    var self = this;

    //Menu and Menu variable initilization
    self.text_enabled = true;
    self.full_screen = false;
    self.height = args.height;
    self.width = args.width;
    var menu = VIZ.Config.plot(self);
    this.div.appendChild(menu);
    this.div.menu = menu;
    console.log(this);

    this.n_lines = args.n_lines || 1;
    this.sim = args.sim;
    this.display_time = args.display_time;

    /** for storing the accumulated data */
    this.data_store = new VIZ.DataStore(this.n_lines, this.sim, 0.01);

    /** draw the plot as an SVG */
    this.svg = d3.select(this.div).append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    /** scales for mapping x and y values to pixels */
    this.scale_x = d3.scale.linear();
    this.scale_y = d3.scale.linear();
    this.scale_y.domain([args.miny || -1, args.maxy || 1]);
    
    /** spacing between the graph and the outside edges (in pixels) */
    this.margin_top = 30;
    this.margin_bottom = 40;
    this.margin_left = 40;
    this.margin_right = 40;
    this.supression_width = 150;

    var axis_time_end =this.svg.append("text")
                    .text("Time: NULL")
                    .attr('class', 'graph_text')
                    .attr('y', args.height - (this.margin_bottom - 20))
                    .attr('x', args.width - (this.margin_right + 20));
        
    this.axis_time_end = axis_time_end[0][0];  

    var axis_time_start =this.svg.append("text")
                    .text("Time: NULL")
                    .attr('class','graph_text')
                    .attr('y', args.height - (this.margin_bottom - 20))
                    .attr('x',this.margin_left - 10);
        
    this.axis_time_start = axis_time_start[0][0];    
    
    if (this.display_time == false) {
        this.axis_time_start.style.display = 'none';
        this.axis_time_end.style.display = 'none';
    }

    /** set up the scales to respect the margins */
    this.scale_x.range([this.margin_left, args.width - this.margin_right]);
    this.scale_y.range([args.height - this.margin_bottom, this.margin_top]);
    
    /** define the x-axis */
    this.axis_x = d3.svg.axis()
        .scale(this.scale_x)
        .orient("bottom")
        .ticks(0);
    this.axis_x_g = this.svg.append("g")
        .attr("class", "axis axis_x")
        .attr("transform", "translate(0," + (args.height - 
                                             this.margin_bottom) + ")")
        .call(this.axis_x);

    /** define the y-axis */
    this.axis_y = d3.svg.axis()
        .scale(this.scale_y)
        .orient("left")    
        .ticks(2);
    this.axis_y_g = this.svg.append("g")
        .attr("class", "axis axis_y")
        .attr("transform", "translate(" + this.margin_left+ ", 0)")
        .call(this.axis_y);

    /** call schedule_update whenever the time is adjusted in the SimControl */    
    this.sim.div.addEventListener('adjust_time', 
            function(e) {self.schedule_update();}, false);
    
    /** create the lines on the plots */
    var line = d3.svg.line()
        .x(function(d, i) {return self.scale_x(times[i]);})
        .y(function(d) {return self.scale_y(d);})
    this.path = this.svg.append("g").selectAll('path')
                                    .data(this.data_store.data);
                                    
    var colors = VIZ.make_colors(this.n_lines);    
    this.path.enter().append('path')
             .attr('class', 'line')
             .style('stroke', function(d, i) {return colors[i];});

    this.on_resize(args.width, args.height);

    this.div.addEventListener('mousewheel', function(e){
        self.on_scroll(e, self.width, self.height)});

};
VIZ.Value.prototype = Object.create(VIZ.Component.prototype);
VIZ.Value.prototype.constructor = VIZ.Value;

/**
 * Receive new line data from the server
 */
VIZ.Value.prototype.on_message = function(event) {
    var data = new Float32Array(event.data);
    this.data_store.push(data);
    this.schedule_update();
}

VIZ.Value.prototype.on_scroll = function(e,w,h) {
    var scroll_speed = 10
    var movement = (e.deltaY / 53) * scroll_speed;
    this.on_resize(w + movement, h + movement)
}
   
/**
 * Redraw the lines and axis due to changed data
 */
VIZ.Value.prototype.update = function() {
    /** let the data store clear out old values */
    this.data_store.update();
        
    /** determine visible range from the VIZ.SimControl */
    var t1 = this.sim.time_slider.first_shown_time;
    var t2 = t1 + this.sim.time_slider.shown_time;
    this.scale_x.domain([t1, t2]);
    
    /** update the lines */
    var self = this;
    var shown_data = this.data_store.get_shown_data();
    var line = d3.svg.line()
        .x(function(d, i) {
            return self.scale_x(
                self.data_store.times[i + self.data_store.first_shown_index]);
            })
        .y(function(d) {return self.scale_y(d);})
    this.path.data(shown_data)
             .attr('d', line);

    this.axis_time_start.textContent =  t1.toFixed(3);

    this.axis_time_end.textContent =  t2.toFixed(3);

    /** update the x-axis */
    this.axis_x_g.call(this.axis_x);         
};

/** 
 * Adjust the graph layout due to changed size
 */
VIZ.Value.prototype.on_resize = function(width, height) {

    //Don't resize in this case
    if (width < this.minWidth || height < this.minHeight) {
        return;
    }
    this.full_screen = false;
    this.width = width;
    this.height = height;
    this.div.style.width = width;
    this.div.style.height = height;
    this.div.style.backgroundColor = 'rgba(255,0,0,0)';
    this.scale_x.range([this.margin_left, width - this.margin_right]);
    this.scale_y.range([height - this.margin_bottom, this.margin_top]);

    //Supress axis start time when user shrinks the plot
    if (this.text_enabled){
        if (width < this.supression_width || this.display_time == false){
            this.axis_time_start.style.display = 'none';
        }
        else{
            this.axis_time_start.style.display = 'block';
        }
    }

    //Adjust positions of time on resize
    this.axis_time_start.setAttribute('y', height - (this.margin_bottom - 20));
    this.axis_time_start.setAttribute('x', this.margin_left - 10 );

    this.axis_time_end.setAttribute('y', height - (this.margin_bottom - 20));
    this.axis_time_end.setAttribute('x', width - (this.margin_right + 20));

    //Adjust positions of x axis on resize
    this.axis_x_g         
        .attr("transform", 
              "translate(0," + (height - this.margin_bottom) + ")");
    this.axis_y_g.call(this.axis_y);         
    this.update();
    
    this.label.style.width = width;
    
};
