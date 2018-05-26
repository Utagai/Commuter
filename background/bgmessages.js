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
    console.log("Sender:")
    console.log(sender);

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
);

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

function getDirectionsToOfficeFrom(latlng, sendResponse) {
  console.log("Mongo latlng: " + mongoLatLng);
  var request = {
    origin: new google.maps.LatLng(latlng.lat, latlng.lng),
    destination: new google.maps.LatLng(mongoLatLng.lat, mongoLatLng.lng),
    travelMode: 'TRANSIT'
  };

  directions.route(request, function(result, status) {
    if (status == 'OK') {
      console.log("Got a response from directions API:");
      console.log(result);
      directionsResult = result;
      let directionsResp = {
        'duration': result.routes[0].legs[0].duration.text,
        'start': result.routes[0].legs[0].start_address,
        'end': result.routes[0].legs[0].end_address,
        'gmapsRes': result
      };

      sendResponse(directionsResp);
    }
  });
}

function getLatLngFromGeocodeResult(ogAddress, results, status) {
  let latlng = {
    'address': ogAddress,
    'valid': status == 'OK'
  };

  if (status == 'OK') {
    latlng.lat = results[0].geometry.location.lat();
    latlng.lng = results[0].geometry.location.lng();
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
