'use strict';

/**
 * Contains logic regarding message passing between the apartment content
 * scripts and the extension.
 *
 * @author may
 */

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Got a request from a content script:");
    console.log(request);
    console.log("Sender:")
    console.log(sender);

    let buildingAddress = request.buildingAddress;

    processAddressMsg(request, sender, sendResponse, buildingAddress);

    return true; // Asynchronous response will be given through gmaps calls!
  }
);

function processAddressMsg(request, sender, sendResponse, address) {
  if (address) {
    geocoder.geocode({ 'address': address },
      function(results, status) {
        let latlng = getLatLngFromGeocodeResult(address, results, status);
        let geocodeMsg = createGeocodeMsg(latlng);
        console.log(geocodeMsg);
        getDirectionsToOfficeFrom(latlng);
        sendResponse({
          duration: geocodeMsg
        });
      }
    );
  } else { /* Ignore this message. */ }
}

function getDirectionsToOfficeFrom(latlng) {
  console.log("Mongo latlng: " + mongo_latlng);
}

function getLatLngFromGeocodeResult(ogAddress, results, status) {
  let latlng = {
    'address': ogAddress,
    'valid': status == 'OK'
  };

  if (status == 'OK') {
    latlng.latitude = results[0].geometry.location.lat();
    latlng.longitude = results[0].geometry.location.lng();
  } else { /* Do nothing */ }

  return latlng;
}

function createGeocodeMsg(latlng) {
  if (latlng.valid) {
    return "Geocode computed for " + latlng.address + ": "
      + JSON.stringify(latlng);
  } else {
    return "Geocode request for address: " + latlng.address
      + " failed due to '" + status + "'."
  }
}
