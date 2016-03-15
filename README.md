# leaflet-map-polygon-hover-geojson
trying to pull data directly from GeoJSON, but reset highlight function not yet working

## Demo (not yet fully working)
- http://jackdougherty.github.io/leaflet-map-polygon-hover-geojson/index.html

## Goal
- A thematic polygon (choropleth) map with hover function, similar to this LeafletJS tutorial (http://leafletjs.com/examples/choropleth.html), but which draws the data directly from the GeoJSON file (ct-towns-density.geojson), rather than a .js file that declares a data variable inside
- Why store the data in a GeoJSON file? It's easier for novices to understand how to create and join GeoJSON data from Mapshaper.org and other tools, without converting it to a .js file with typing "var data =" at the front and a semicolon at the end. If successful, will include this version in open-access book, Data Visualization for All (http://DataVizForAll.org)

## Problem
- Everything seems to work except the reset highlight function. Hovering over an area causes grayed outline to remain, with no reset. I cannot figure out how to rewrite this function to cooperate with rest of this code. See script.js line 71 https://github.com/JackDougherty/leaflet-map-polygon-hover-geojson/blob/master/script.js#L71

## Compare with
- See similar working version that draws data from a .js file with declared variable, rather than storing data directly in a .geojson file
- http://jackdougherty.github.io/leaflet-map-polygon-hover/index.html
