'use strict';

var geocoder;
var directionsDisplay;

var map;

var mongoIconUrl = "https://static.filehorse.com/icons/"
  + "developer-tools/mongodb-icon-32.png";
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

  console.log("Lats: " + JSON.stringify(lats));
  console.log("Lngs: " + lngs);

  return new google.maps.LatLng(avg(lats), avg(lngs));
  //return { 'lat': avg(lats), 'lng': avg(lngs) };
}

function potentiallyUpdateMap() {
  console.log("Popup clicked!");
  chrome.runtime.sendMessage(
    {
      'source': 'popup'
    },
    function(response) {
      console.log(response);
      let directionsCoords = response.routes[0].overview_path;
      console.log(directionsCoords);
      let directionsPath = new google.maps.Polyline({
          path: directionsCoords,
          geodesic: true,
          strokeColor: '#ffb5cc',
          strokeOpacity: 0.7,
          strokeWeight: 5
      });
      let avgLatLng = getAvgLatLng(directionsCoords);
      map.setCenter(avgLatLng);
      map.setZoom(kPathZoom);
      directionsPath.setMap(map);
    }
  );
}

function initGmaps() {
  console.log("Initializing map in popup @ " + new Date().getTime());
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById('map'), {
    center: mongoLatLng,
    zoom: kNoPathZoom
  });

  let marker = new google.maps.Marker(
    {
      position: mongoLatLng,
      icon: mongoIconUrl,
      map: map
    }
  );

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsDisplay.setRouteIndex(0);
  directionsDisplay.setOptions({
    'hideRouteList': true,
    'draggable': false,
    'suppressMarkers': true,
    'suppressInfoWindows': true
  });
  potentiallyUpdateMap();
}

loadMapsAPI();
