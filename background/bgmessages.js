'use strict';

/**
 * Contains logic regarding message passing between the apartment content
 * scripts and the extension.
 *
 * @author may
 */

var directionsResult;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Got a request from somewhere:");
    console.log(request);
    return dispatchMessage(request, sender, sendResponse);
  }
);

function dispatchMessage(request, sender, sendResponse) {
  if (request.source == 'popup') {
    console.log("Here is the current directions Result: ");
    console.log(directionsResult);
    sendResponse(directionsResult);
  } else {
    let buildingAddress = request.buildingAddress;
    processAddressMsg(request, sender, sendResponse, buildingAddress);
    return true; // Asynchronous response will be given through gmaps calls!
  }
}

function processAddressMsg(request, sender, sendResponse, address) {
  if (address) {
    geocoder.geocode({ 'address': address },
      function(results, status) {
        let latlng = getLatLngFromGeocodeResult(address, results, status);
        let geocodeMsg = createGeocodeMsg(latlng);
        console.log(geocodeMsg);
        getDirectionsToOfficeFrom(latlng, sendResponse);
      }
    );
  } else { /* Ignore this message. */ }
}

