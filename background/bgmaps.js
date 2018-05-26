'use strict';

var geocoder;
var directions;

function initGmaps() {
  console.log("Maps initialized.");
  geocoder = new google.maps.Geocoder();
  console.log("Geocoder object: " + geocoder);
  directions = new google.maps.DirectionsService();
  console.log("Directions object: " + directions);
}
