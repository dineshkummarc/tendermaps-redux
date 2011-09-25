/* drawing functions for tendermaps
   mike tahani		m.tahani@gmail.com
*/

window.brush_type = 'path';
window.brush_color = '#ff0000';
window.brush_size = 10;
window.canvasWidth  = 2361;
window.canvasHeight = 1633;
window.pathstring = '';
window.draw_on = "False";
window.offset = 10;
window.dotX;
window.dotY;
window.objectlist = [];
window.on_screen_elements = [];

function setPoint ( event ) {
    // begin drawing
    sx = event.pageX - offset;
    sy = event.pageY - offset;
	
    //var newpoint = paper.circle( sx , sy , BRUSHsize / 2 );
    //newpoint.attr({'fill': BRUSHcolor, 'stroke': BRUSHcolor});
    pathstring = "M " + sx + " " + sy;
}

function drawDot(dx,dy) {
    dx = dx - offset;
    dy = dy - offset;
    dotX = dx;
    dotY = dy;
    
    draw_raphael_obj({'cx':dx, 'cy':dy, 'r':brush_size});
    }

function drawPath ( event ) {
    // draw the path
    ex = event.pageX - offset;
    ey = event.pageY - offset;
	
    pathstring += " L " + ex + " " + ey;

    draw_raphael_obj( pathstring, {
		     'stroke' : brush_color,
		     'stroke-width': brush_size });
	
}

function up() {
    // create a json object and add it to the list of objects
    if (brush_type == 'path') {
        draw_on = 'False';
	var drawn_obj = 
                    {
                        "d"			: pathstring,
                        "fill"			: brush_color, 
                        "stroke"		: brush_color,
                        "stroke-width"		: brush_size
                    };
        
        pathstring = '';
    }
		
    else if ( brush_type == 'circle' ) {
        var drawn_obj = 
                    {
                        "cx"		: dotX, 
                        "cy"		: dotY,
                        "r"		: brush_size
                    };
            
    }

    window.on_screen_elements.push(drawn_obj);
            
}

function draw_raphael_obj(obj_args, obj_attrs) {
    // draw a raphael svg object on screen
    if (obj_attrs) {
	// it's a path; expects a path string as obj_args
	var new_obj = paper.path( obj_args );
	new_obj.attr( obj_attrs );
	new_obj.attr( { "stroke-opacity"	: 1,
                        "stroke-linecap"	: "round",
                        "stroke-linejoin"	: "round"
		      });
    } else {
	// it's a circle; expects an array as obj_args
	var new_obj = paper.circle ( obj_args['cx'], obj_args['cy'], obj_args['r'] );
	new_obj.attr({fill:'#000' , stroke:'#000'});
    }
}

function reDraw( ) {
    // clear the canvas and redraw everything in the on-screen-objects list
    paper.clear();

    for (var i = 0; i <= on_screen_elements.length; i++) {	
        if ( on_screen_elements[i]['d'] ) {
	    // it's a path
	    delete on_screen_elements[i]['fill'];
	    draw_raphael_obj( on_screen_elements[i]['d'], on_screen_elements[i]);
        } else {
	    // it's a circle
	    draw_raphael_obj(on_screen_elements[i]);
	}      
    }

}

window.undone = [];
function undo()
	{
		// undo
		if ( on_screen_elements.length > 0 )
			{
				undone.push(on_screen_elements.pop());
				reDraw();
			}
	}

function redo()
	{
		// redo
		if ( undone.length > 0 )
			{
				on_screen_elements.push(undone.pop());
				reDraw();
			}
	
	}

function clearall()
	{
		paper.clear();		// clear the canvas
		window.undone = [];		// clear the list of "undo"s (redo() relies on this list)
		clear_svgbox();		// clear the debug box
		window.on_screen_elements = [];
	}
        
function add_json_to_svgbox() { document.form.svg_data.value = JSON.stringify(window.on_screen_elements); }
function clear_svgbox()   { document.form.svg_data.value = ''; }