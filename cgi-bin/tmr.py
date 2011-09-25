#!c:/python26/python.exe -u
import cgi
import cgitb; cgitb.enable()    # debugging
import collections, json, hashlib, os

print "Content-type: text/html\n\n"

BATIK_JARFILE = '../batik-1.7/batik-rasterizer.jar' # apache batik for svg->png
PNG_DIR = '../png/'
SVG_DIR = '../svg/'

def get_form_values():
   """ get form values from frontend """
   keys = [ 'authorname', 'authoremail', 'authorsite', 'authortype',
            'description', 'svg_data' ]
   form = cgi.FieldStorage()
   return dict( zip( keys, [ form.getvalue(val) for val in keys ] ) )

def sort_svg_by_color(svg_data):
   """ sort the svg objects into different categories based on color/'heart' """
   colors = { '#ff0000': 'red', '#00ff00': 'green', '#0000ff': 'blue' }
   drawn_objects = collections.defaultdict(list)
   
   for obj in json.loads( svg_data ):
      if 'd' in obj:
         # it's a path
         drawn_objects[ colors[ obj['stroke'] ] ].append( obj )
      else:
         # it's a circle
         drawn_objects['heart'].append( obj )
   return drawn_objects

def svg_to_files(drawn_objects):
   """ create svg files & rasterized png files, one for each category """
   # should check for collisions:
   unique_id = hashlib.md5( str(drawn_objects) ).hexdigest()
   categories = ['red', 'green', 'blue', 'heart']
   svg_file_locations = []
   for category in categories:
     file_prefix = "%s_%s." % ( unique_id, category )
     svg_file_locations.append(write_svg_to_file( file_prefix, drawn_objects[category] ) )
   rasterize_svg ( file_prefix, svg_file_locations )
   return svg_file_locations

def write_svg_to_file(file_prefix, svg):
   """ write svg data to a file, returns file name/location """
   filename = SVG_DIR + file_prefix + 'svg'   
   header = """
            <?xml version="1.0" standalone="no"?>
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
            "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
            <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='2361' height='1633'>
            """.strip()
   handler = open(filename, 'w')
   handler.write(header)
   # "svg" is a list containing dicts of svg markup data
   for svg_markup in svg:
      if 'heart' not in filename:
         shape = "path"
         svg_markup.update( { "stroke-opacity":'1', "stroke-linecap":'round',
                              "stroke-linejoin":'round', "fill":'none' } )
      else:
         shape = "circle"
         svg_markup.update( { "stroke":"#000", "stroke-width":'3', "fill":'none' } )
      
      tags = format_svg_tags(svg_markup)
      svg_out_str = "<%s %s />" % (shape, tags)
      handler.write(svg_out_str)
   
   handler.write("</svg>")
   handler.close()
   return filename

def format_svg_tags(svg_dict):
   """ gets a dict of svg data, returns a string of svg-markup-formatted data """
   return ' '.join( [ "%s=\"%s\"" % (tag, svg_dict[tag]) for tag in svg_dict ] )

def rasterize_svg(file_prefix, svg_file_locations):
   """ convert svg to png using batik; do them all in one go cuz it's faster """
   os.system("java -jar %s %s -d %s"
                  % ( BATIK_JARFILE, ' '.join(svg_file_locations), PNG_DIR) )
   return
   

def main():
   formvals = get_form_values()
   print "<b>get_form_values():</b>", formvals
   print "<hr />"
   sorted_svg = sort_svg_by_color( formvals['svg_data'] )
   print "<b>sort_svg_by_color():</b>", sorted_svg
   print "<hr />"
   svg_to_files(sorted_svg)
   print "saved to files"
   print "<hr />"
   print "finished"
   
main()
