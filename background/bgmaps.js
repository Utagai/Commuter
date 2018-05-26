'use strict';

var geocoder;

function initMap() {
  console.log("Maps initialized.");
  geocoder = new google.maps.Geocoder();
  console.log("Geocoder object: " + geocoder);
}
