'use strict';

/* eslint-disable no-unused-vars */
let destLatLng;
let destAddr;
let destState;
/* eslint-enable no-unused-vars */


/* eslint-disable no-unused-vars */
/**
 * Sets the values of destination global variables.
 *
 * These 'destination global variables' are:
 *  1. destLatLng
 *  2. destAddr
 *  3. destState
 *
 * These globals refer to the location of the user's workplace.
 *
 * @param {object} site The ApartmentSite that is asking for the initialization
 *  of the destination variables.
 * @param {function} callback The function to call once the globals have been
 *  set.
 */
function setDestGlobals(site, callback) {
  chrome.storage.sync.get(['destAddress', 'hint', 'destLatLng'],
    function(result) {
      console.log('Address global stored values: ' + JSON.stringify(result));
      console.log(result);
      if (result.destAddress === undefined || result.destLatLng === undefined
        || result.hint === undefined) {
        console.log('Some things were undefined, skipping.');
        return;
      } else {
        console.log('All defined, setting destState to: ' + result.hint);
        destAddr = result.destAddress;
        destLatLng = result.destLatLng;
        destState = result.hint;
      }

      callback(site);
    }
  );
}
/* eslint-enable no-unused-vars */

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
  setDestGlobals(null, function() {
    return undefined;
  });
}
/* eslint-enable no-unused-vars */
