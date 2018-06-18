'use strict';

var mongoLatLng = { lat: 40.7627479, lng: -73.9872048 };
var mongoAddr = "W 50th St, New York, NY";
var mongoState = "NY";

chrome.storage.sync.get(['destAddress', 'destLatLng'], function(result) {
  console.log("Result: " + JSON.stringify(result));
  console.log('Value of dest address was set to ' + result.destAddress);
  console.log('Value of dest latlng was set to ' + JSON.stringify(result.destLatLng));
  if (result.destAddress === undefined || result.destLatLng === undefined) {
    return;
  } else {
    mongoAddr = result.destAddress;
    mongoLatLng = result.destLatLng;
  }
});

function loadMapsAPI() {
  var script = document.createElement( 'script' );
  script.src = "https://maps.googleapis.com/maps/api/js"
    + "?key=" + gmaps_key + "&callback=initGmaps"
  document.body.appendChild(script);
}
