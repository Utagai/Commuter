'use strict';

var mongoLatLng = { lat: 40.7627479, lng: -73.9872048 };
var mongoAddr = "W 50th St, New York, NY";
var mongoState = "NY";

function loadMapsAPI() {
  var script = document.createElement( 'script' );
  script.src = "https://maps.googleapis.com/maps/api/js"
    + "?key=" + gmaps_key + "&callback=initGmaps"
  document.body.appendChild(script);
}
