'use strict';

var geocoder;
var directionsDisplay;

var map;

var mongoIconUrl = "https://static.filehorse.com/icons/"
  + "developer-tools/mongodb-icon-32.png";

function potentiallyUpdateMap() {
  console.log("Popup clicked!");
  chrome.runtime.sendMessage(
    {
      'source': 'popup'
    },
    function(response) {
      console.log(response);
      directionsDisplay.setDirections(response);
    }
  );
}

function initGmaps() {
  console.log("Initializing map in popup @ " + new Date().getTime());
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById('map'), {
    center: mongoLatLng,
    zoom: 15
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
