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

function drawDot(dx,dy) {
    dx = dx - offset;
    dy = dy - offset;
    dotX = dx;
    dotY = dy;
		
    var dot = paper.circle ( dx , dy , brush_size );
    dot.attr({fill:'#000' , stroke:'#000'});
    }

function setPoint ( event ) {
    // begin drawing
    sx = event.pageX - offset;
    sy = event.pageY - offset;
	
    //var newpoint = paper.circle( sx , sy , BRUSHsize / 2 );
    //newpoint.attr({'fill': BRUSHcolor, 'stroke': BRUSHcolor});
    pathstring = "M " + sx + " " + sy;
}
   
function drawPath ( event ) {
    // draw the path
    ex = event.pageX - offset;
    ey = event.pageY - offset;
	
    pathstring += " L " + ex + " " + ey;

    var newpath = paper.path(pathstring);
    newpath.attr({
                    'stroke'            : brush_color,
                    'stroke-width'      : brush_size,
                    'stroke-linecap'    : 'round',
                    'stroke-linejoin'   : 'round'
                });
	
}

function up() {
    // create a json object and add it to the list of objects
    if (brush_type == 'path') {
        draw_on = 'False';
	var drawn_obj = 
                    {
                        "type"			: "path",
                        "d"			: pathstring,
                        "fill"			: brush_color, 
                        "stroke"		: brush_color,
                        "stroke-opacity"	: 1,
                        "stroke-width"		: brush_size,
                        "stroke-linecap"	: "round",
                        "stroke-linejoin"	: "round"
                    };
        
        pathstring = '';
    }
		
    else if ( brush_type == 'circle' ) {
        var drawn_obj = 
                    {
                        "type"		: "circle",
                        "cx"		: dotX, 
                        "cy"		: dotY,
                        "r"		: brush_size,
                        "stroke"	: brush_size
                    };
            
    }

    window.on_screen_elements.push(drawn_obj);
            
}

function reDraw( ) {
    // clear the canvas and redraw everything in the object list
    paper.clear();

    for (var i = 0; i <= on_screen_elements.length; i++) {	
        if ( on_screen_elements[i]['type'] == 'path' ) {
            var redraw_pathstring = on_screen_elements[i]['d'];
            var newpath = paper.path(redraw_pathstring);
            newpath.attr({
                            "stroke"		: on_screen_elements[i]['stroke'],
                            "stroke-opacity"	: on_screen_elements[i]['stroke-opacity'],
                            "stroke-width"	: on_screen_elements[i]['stroke-width'],
                            "stroke-linecap"	: on_screen_elements[i]['stroke-linecap'],
                            "stroke-linejoin"	: on_screen_elements[i]['stroke-linejoin']
                        });				

        }
        else if ( on_screen_elements[i]['type'] == 'circle' ) {
            var newcircle = paper.circle( on_screen_elements[i]['cx'] ,
                                          on_screen_elements[i]['cy'] ,
                                          on_screen_elements[i]['r'] );
                        newcircle.attr({
                                            fill:'#000',
                                            stroke:'#000'
                                       });
                    }
                            
                    else
                            {
                                    ;
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