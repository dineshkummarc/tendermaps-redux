# Tendermaps Redux

A sketchpad app for [Tendermaps](http://tendermaps.com).

## Technical Details

Starts as a raphael.js layer on top of an image of the Tenderloin in SF.

1. All drawing actions are recorded as SVG (since we can't access SVG data via raphael).
2. SVG data is sent to the backend when the map is submitted.
3. SVG data is converted to PNG using Apache Batik.

## Problems

There's way too much post-processing. I want to have the frontend append the non-dynamic SVG variables
("stroke-opacity", "stroke-linecap", etc) one time, and not have that reiterated on the backend. Also,
there's no "pretty" transition after submitting the map.