'use strict';

const geocoder = undefined;
const directions = undefined;

/** Initializes Google Maps API objects (geocoder, directions). */
function initGmaps() { // eslint-disable-line no-unused-vars
  console.log('Maps initialized.');
  geocoder = new google.maps.Geocoder();
  console.log('Geocoder object: ' + geocoder);
  directions = new google.maps.DirectionsService();
  console.log('Directions object: ' + directions);
}
