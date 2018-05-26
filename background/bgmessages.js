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
    directionsResult = null; // Clear directions result if needed.
    if (request.type == 'building') {
      let buildingAddress = request.addressInfo;
      processBuildingAddrMsg(request, sender, sendResponse, buildingAddress);
    } else if (request.type == 'listings') {
      let buildingAddresses = request.addressInfo;
      processListingsMsg(request, sender, sendResponse, buildingAddresses);
    }
    return true; // Asynchronous response will be given later.
  }
}

function processBuildingAddrMsg(request, sender, sendResponse, address) {
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

function processListingsMsg(request, sender, sendResponse, addresses) {
  if (addresses.length > 0) {
    let numArticles = addresses.length;
    sendResponse({
      'durations': [...Array(numArticles).keys()].map(function() {
        return Math.floor(Math.random() * 50)
      }),
      'gmapsRes': {}
    });
  } else { /* Ignore this message. */ }
}
