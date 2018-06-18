'use strict';

var geocoder;
var directionsDisplay;

var map;

var kNoPathZoom = 15;
var kPathZoom = 13;

function avg(nums) {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }

  return sum/nums.length;
}

function getAvgLatLng(coords) {
  let lats = coords.map(function(coord) {
    return coord.lat;
  });

  let lngs = coords.map(function(coord) {
    return coord.lng;
  });

  return new google.maps.LatLng(avg(lats), avg(lngs));
}

function refocusMap(pathCoords) {
  let avgLatLng = getAvgLatLng(pathCoords);
  map.setCenter(avgLatLng);
  map.setZoom(kPathZoom);
}

function drawPolyline(coords) {
  console.log(coords);
  let directionsPath = new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#ffb5cc',
      strokeOpacity: 0.7,
      strokeWeight: 5
  });

  directionsPath.setMap(map);
}

function updateMap(response) {
  console.log(response);
  if (!response) { return; } // No response given.
  let directionsCoords = response.routes[0].overview_path;
  drawPolyline(directionsCoords);
  refocusMap(directionsCoords);
}

function potentiallyUpdateMap() {
  console.log("Popup clicked!");
  chrome.runtime.sendMessage(
    {
      'source': 'popup'
    },
    updateMap
  );
}

function initMaps() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: destLatLng,
    zoom: kNoPathZoom
  });

  let marker = new google.maps.Marker(
    {
      position: destLatLng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: 'green',
        fillOpacity: 0.7,
        strokeColor: 'green',
        strokeOpacity: 0.7
      },
      map: map
    }
  );

}

function initDisplay() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsDisplay.setRouteIndex(0);
  directionsDisplay.setOptions({
    hideRouteList: true,
    draggable: false,
    suppressMarkers: true,
    suppressInfoWindows: true
  });
}

function initGmaps() {
  console.log("Initializing map in popup @ " + new Date().getTime());
  geocoder = new google.maps.Geocoder();

  initMaps();
  initDisplay();

  potentiallyUpdateMap();
}

loadMapsAPI();
