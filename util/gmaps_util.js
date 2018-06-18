'use strict';

var mongoLatLng = { lat: 40.7627479, lng: -73.9872048 };
var mongoAddr = "W 50th St, New York, NY";
var mongoState = "NY";

chrome.storage.sync.get(['destAddress', 'hint', 'destLatLng'],
  function(result) {
    console.log("Address global stored values: " + JSON.stringify(result));
    if (result.destAddress === undefined || result.destLatLng === undefined
      || result.hint === undefined) {
      return;
    } else {
      mongoAddr = result.destAddress;
      mongoLatLng = result.destLatLng;
      mongoState = result.hint;
    }
  }
);

function loadMapsAPI() {
  var script = document.createElement( 'script' );
  script.src = "https://maps.googleapis.com/maps/api/js"
    + "?key=" + gmaps_key + "&callback=initGmaps"
  document.body.appendChild(script);
}
