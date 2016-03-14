var map = L.map('map').setView([41.5, -72.7], 9);

// customize source link to your GitHub repo
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-polygon-hover">open-source code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');


new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

/* match data to column header */
info.update = function (props) {
  this._div.innerHTML = '<h4>Connecticut Town<br />Population density 2010</h4>' +  (props ?
    '<b>' + props.town + '</b><br />' + props.density2010 + ' people / mi<sup>2</sup>'
    : 'Hover over a town');
};
info.addTo(map);

// get color depending on population density value
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

function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density2010) /* match to data column header */
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

// This is the original variable declaration and function
// var geojson;
//
// function resetHighlight(e) {
//   geojson.resetStyle(e.target);
//   info.update();
// }

// my attempt to rewrite this
function resetHighlight(e) {
  resetStyle(e.target);
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

// insert data file to be uploaded below
$.getJSON("ct-towns-density.geojson", function (data) {
  var geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

// set grades to match ranges above
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
