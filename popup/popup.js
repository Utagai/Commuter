'use strict';

/* eslint-disable no-unused-vars */
let geocoder;
/* eslint-enable no-unused-vars */
let directionsDisplay;

let map;

let kNoPathZoom = 15;
let kPathZoom = 13;

/**
 * Computes the average of a series of numbers.
 *
 * @param {array} nums An array of numbers.
 * @return {number} The average of nums.
 */
function avg(nums) {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }

  return sum/nums.length;
}

/**
 * Gets the average latitude and longitude of a series of LatLng coordinates.
 *
 * @param {array} coords An array of LatLng coordinates.
 * @return {LatLng} A new LatLng that is the average of all given LatLngs.
 */
function getAvgLatLng(coords) {
  let lats = coords.map(function(coord) {
    return coord.lat;
  });

  let lngs = coords.map(function(coord) {
    return coord.lng;
  });

  return new google.maps.LatLng(avg(lats), avg(lngs));
}

/**
 * 'Refocuses' the Google Maps display in the extension's popup to fit the given
 * path (its coordinates) in it without needing the user to drag the map.
 *
 * Honestly, this is just a glorified average, and its probably possible for
 * this to fail in crazy cases, but it serves it's purpose well enough.
 *
 * @param {array} pathCoords A series of coordinates representing the path from
 *  'home' to work.
 */
function refocusMap(pathCoords) {
  let avgLatLng = getAvgLatLng(pathCoords);
  map.setCenter(avgLatLng);
  map.setZoom(kPathZoom);
}

/**
 * Draws the path defined by the given coords onto the Google Maps display.
 *
 * @param {array} coords An array of LatLng coords that define a route/path.
 */
function drawPolyline(coords) {
  console.log(coords);
  let directionsPath = new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#ffb5cc',
      strokeOpacity: 0.7,
      strokeWeight: 5,
  });

  directionsPath.setMap(map);
}

/**
 * Given a response detailing a route/path, this function draws the route onto
 * the map and refocuses it.
 *
 * This map essentially calls other helper functions in sequence.
 *
 * @param {object} response A response object detailing a route/path to draw
 *  onto the map.
 */
function updateMap(response) {
  console.log(response);
  if (!response) {
    return;
  } // No response given.
  let directionsCoords = response.routes[0].overview_path;
  drawPolyline(directionsCoords);
  refocusMap(directionsCoords);
}

/**
 * Fire a popup message to the background, in the off-chance that we may need to
 * update the map with new information.
 */
function firePopupMessage() {
  console.log('Popup clicked!');
  chrome.runtime.sendMessage(
    {
      'source': 'popup',
    },
    updateMap
  );
}

/**
 * Initialize the Google Maps object.
 *
 * The initialization of the map display is done in initDisplay().
 */
function initMaps() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: destLatLng,
    zoom: kNoPathZoom,
  });
}

/**
 * Initializes the actual display contents of the Google Maps display.
 */
function initDisplay() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsDisplay.setRouteIndex(0);
  directionsDisplay.setOptions({
    hideRouteList: true,
    draggable: false,
    suppressMarkers: true,
    suppressInfoWindows: true,
  });
}

/* eslint-disable no-unused-vars */
/**
 * Initializes the GMaps JS API objects, such as geocoder, the maps object and
 * the display for the maps object.
 */
function initGmaps() {
  console.log('Initializing map in popup @ ' + new Date().getTime());
  geocoder = new google.maps.Geocoder();

  initMaps();
  initDisplay();

  firePopupMessage();
}
/* eslint-disable no-unused-vars */

loadMapsAPI();
