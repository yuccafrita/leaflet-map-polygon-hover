// Edit the center point and zoom level
var map = L.map('map', {
  center: [41.5, -72.7],
  zoom: 9,
  scrollWheelZoom: false
});

// Edit links to your GitHub repo and data source credit
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-polygon-hover">open-source code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
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

// Edit text and variables to match those in your GeoJSON data
info.update = function (props) {
  this._div.innerHTML = '<h4>Connecticut Town<br />Population density 2010</h4>' +  (props ?
    '<b>' + props.town + '</b><br />' + props.density2010 + ' people / mi<sup>2</sup>'
    : 'Hover over a town');
};
info.addTo(map);

// Edit ranges and colors to match your data; see http://colorbrewer.org
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

// Edit the getColor property to match data column header in your GeoJson file
function style(feature) {
  return {
    weight: 1,
    opacity: 1,
    color: 'black',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.density2010)
  };
}

// this highlights the layer on hover
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 4,
    color: 'black',
    fillOpacity: 0.7
  });

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geoJsonLayer.setStyle(style); /* revised from original tutorial*/
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

// Edit to upload GeoJSON data file from your local directory; removed var = geoJsonLayer since this is declared above
$.getJSON("ct-towns-density.geojson", function (data) {
  geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

// Modify grades to match the ranges above
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
