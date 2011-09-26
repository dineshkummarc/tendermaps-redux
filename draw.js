/* drawing functions for tendermaps
   mike tahani		m.tahani@gmail.com
*/

window.brush_type = 'path';
window.brush_color = '#ff0000';
window.brush_size = 10;
window.rmod = 3; // brush size for path * modifier = circle radius
window.canvasWidth  = 2361;
window.canvasHeight = 1633;
window.pathstring = '';  // the svg string for a path
window.draw_on = false;	 // has the user clicked down to draw a path?
window.dragged = false;  // has the user dragged the mouse?
window.offset = 10;	// don't center on the mouse cursor
window.on_screen_elements = [];


function setPoint ( event ) {
    // begin drawing
    window.dragged = true;
    sx = event.pageX - offset;
    sy = event.pageY - offset;
    pathstring = "M " + sx + " " + sy;
}

function drawDot(dx,dy) {
    window.dx = dx - offset;
    window.dy = dy - offset;
    
    draw_raphael_obj({'cx':dx, 'cy':dy, 'r':brush_size*rmod});
}

function drawPath ( event ) {
    // draw the path
    
    if (window.dragged) {
	ex = event.pageX - offset;
	ey = event.pageY - offset;
	pathstring += " L " + ex + " " + ey;
    
	draw_raphael_obj( pathstring, {
			    'stroke'       : brush_color,
			    'stroke-width' : brush_size });
    }
    
}

function up() {
    // create a json object and add it to the list of objects
    window.dragged = false;
    if (brush_type == 'path') {	
	window.draw_on = false;
	var drawn_obj = 
		    {
			"d" 		: pathstring,
			//"fill"		: brush_color, 
			"stroke"	: brush_color,
			"stroke-width"	: brush_size
		    };
	
	if (pathstring.indexOf('L') > -1) {
	    // if user clicked but didn't drag, don't add an empty path string to the on-screen elements
	    window.on_screen_elements.push(drawn_obj);
	    redraw_canvas();	// fixes a weird bug that caused svg to be drawn on-screen,
				// but not saved to svg_data
	    //document.dbg.debugbox.value = '';
	    //document.dbg.debugbox.value = document.dbg.debugbox.value + (JSON.stringify(drawn_obj)+'\n');
	}
    
	pathstring = '';
	
    } else if ( brush_type == 'circle' ) {
        var drawn_obj = 
                    {
                        "cx" : dx, 
                        "cy" : dy,
                        "r"  : brush_size * rmod
                    };
	window.on_screen_elements.push(drawn_obj);
	//document.dbg.debugbox.value = document.dbg.debugbox.value + (JSON.stringify(drawn_obj)+'\n');
            
    } else {
	;   
    }
}

function draw_raphael_obj(obj_args, obj_attrs) {
    // draw a raphael svg object on screen
    if (obj_attrs) {
	// it's a path; expects a path string as obj_args
	var new_obj = paper.path( obj_args );
	new_obj.attr( obj_attrs );
	new_obj.attr({
			"stroke-opacity"	: 1,
                        "stroke-linecap"	: "round",
                        "stroke-linejoin"	: "round"
		      });
    } else {
	// it's a circle; expects an array as obj_args
	var new_obj = paper.circle ( obj_args['cx'], obj_args['cy'], obj_args['r'] );
	new_obj.attr({
			//fill : '#000' ,
			'stroke' : '#000',
			'stroke-width' : 3
		     });
    }
}

function redraw_canvas( ) {
    // clear the canvas and redraw everything in the on-screen-objects list
    paper.clear();

    for (var i = 0; i <= on_screen_elements.length; i++) {	
        if ( on_screen_elements[i]['d'] ) {
	    // it's a path
	    //delete on_screen_elements[i]['fill']; // svg's "fill" attr != raphael's "fill" attr
	    draw_raphael_obj(on_screen_elements[i]['d'], on_screen_elements[i]);
        } else {
	    // it's a circle
	    draw_raphael_obj(on_screen_elements[i]);
	}      
    }

}

window.undone = [];
function undo() {
    // undo
    if ( on_screen_elements.length > 0 ) {
	undone.push( on_screen_elements.pop() );
	redraw_canvas();
    }
}

function redo() {
    // redo
    if ( undone.length > 0 ) {
	on_screen_elements.push( undone.pop() );
	redraw_canvas();
    }
}

function clearall() {
    paper.clear();		// clear the canvas
    window.undone = [];		// clear the list of "undo"s (redo() relies on this list)
    clear_svgbox();		// clear all svg data
    window.on_screen_elements = [];
}
        
function add_json_to_svgbox() { document.form.svg_data.value = JSON.stringify(window.on_screen_elements); }
function clear_svgbox()   { document.form.svg_data.value = ''; }