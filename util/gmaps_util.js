'use strict';

var destLatLng;
var destAddr;
var destState;

chrome.storage.sync.get(['destAddress', 'hint', 'destLatLng'],
  function(result) {
    console.log("Address global stored values: " + JSON.stringify(result));
    if (result.destAddress === undefined || result.destLatLng === undefined
      || result.hint === undefined) {
      return;
    } else {
      destAddr = result.destAddress;
      destLatLng = result.destLatLng;
      destState = result.hint;
    }
  }
);

function loadMapsAPI() {
  var script = document.createElement( 'script' );
  script.src = "https://maps.googleapis.com/maps/api/js"
    + "?key=" + gmaps_key + "&callback=initGmaps"
  document.body.appendChild(script);
}
