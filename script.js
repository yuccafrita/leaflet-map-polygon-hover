var map = L.map('map').setView([41.5, -72.7], 9);

// customize source link to your GitHub repo
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-polygon-hover-geojson">open-source code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');

// basemap layer
new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// this control shows polygon info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

// revise text and variables to match those in your GeoJSON data
info.update = function (props) {
  this._div.innerHTML = '<h4>Connecticut Town<br />Population density 2010</h4>' +  (props ?
    '<b>' + props.town + '</b><br />' + props.density2010 + ' people / mi<sup>2</sup>'
    : 'Hover over a town');
};
info.addTo(map);

// revise ranges and colors to match your data; see http://colorbrewer.org
function getColor(d) {
  return d > 5000 ? '#800026' :
         d > 1000 ? '#BD0026' :
         d > 500  ? '#E31A1C' :
         d > 200  ? '#FC4E2A' :
         d > 100  ? '#FD8D3C' :
         d > 50   ? '#FEB24C' :
         d > 30   ? '#FED976' :
                    '#FFEDA0';
}

// rewrite the getColor property to match your GeoJson data column header
function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density2010)
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

// rewrote this function from original to setStyle(style)
function resetHighlight(e) {
  geojson.setStyle(style);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

// insert the GeoJSON data file name in your local directory
$.getJSON("ct-towns-density.geojson", function (data) {
  var geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

// revise grades to match your ranges above
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 30, 50, 100, 200, 500, 1000, 5000],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(map);
