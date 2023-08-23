//   // Load the GeoJSON data.
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

  // Get the data with d3.
d3.json(geoData).then(function(data) {
    createMap(data.features);

//       let geometry = data.features.geometry;
//       // let coords = geometry.coordinates;

});

function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Define a color scale for depth
  var depthScale = d3.scaleLinear()
    .domain([0, d3.max(earthquakes, function(d) { return d.geometry.coordinates[2];})]) 
    .range(['green', 'red']); 

  var earthquakesLayer = L.layerGroup();
  // Loop through the earthquake data and create markers for each earthquake.
  for (var i = 0; i < earthquakes.length; i++) {
    var earthquake = earthquakes[i];
    var coords = earthquake.geometry.coordinates;
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];

    // Calculate the color based on depth using the color scale
    var color = depthScale(depth);

    var marker = L.circleMarker([coords[1], coords[0]], {
      radius: magnitude * 3,
      color: color,
      fillColor: color, 
      fillOpacity: 0.5
    });

    // Create a tooltip content with magnitude, location, and depth information
    var tooltipContent = `
      Magnitude: ${magnitude}<br>
      Location: ${coords[1]}, ${coords[0]}<br>
      Depth: ${depth}
    `;

    // Bind the tooltip content to the marker
    marker.bindPopup(tooltipContent);

    marker.addTo(earthquakesLayer);
  }
  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakesLayer
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakesLayer]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

