#!c:/python26/python.exe -u

import cgi
import cgitb; cgitb.enable()    # debugging
#import sqlite3
import time, random, re, os, json

print "Content-type: text/html\n\n"

metadata_vars = [ 'authorname', 'authoremail', 'authorsite', 'authortype',
                  'description', 'svg_data' ]
form_values = {}

form = cgi.FieldStorage()

for info in metadata_vars:
   if form.getvalue(info):
       form_values[info] = cgi.escape( form.getvalue(info) )
   else:
       form_values[info] = "not provided"

# rasterizer functions coming soon

print form_values
