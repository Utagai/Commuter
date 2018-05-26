'use strict';

function loadMapsAPI() {
  var script = document.createElement( 'script' );
  script.src = "https://maps.googleapis.com/maps/api/js"
    + "?key=" + gmaps_key + "&callback=initMap"
  document.body.appendChild(script);
}
