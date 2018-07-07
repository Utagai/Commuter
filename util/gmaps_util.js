'use strict';

/* eslint-disable no-unused-vars */
let destLatLng;
let destAddr;
let destState;
/* eslint-enable no-unused-vars */

chrome.storage.sync.get(['destAddress', 'hint', 'destLatLng'],
  function(result) {
    console.log('Address global stored values: ' + JSON.stringify(result));
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

/* eslint-disable no-unused-vars */
/**
 * Loads the maps API by injecting the maps script into the document.
 *
 * Seems to be a typical way of getting Maps JS API into the scope.
 */
function loadMapsAPI() {
  let script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js'
    + '?key=' + gmapsKey + '&callback=initGmaps';
  document.body.appendChild(script);
}
/* eslint-enable no-unused-vars */
