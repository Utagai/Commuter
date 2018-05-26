'use strict';

function getDirectionsMultiple(latlngs, sendResponse) {
  let latlngsResults = {}
  function saveResult(result) {
    console.log("Saving result for latlng: " + JSON.stringify(result.origin));
    latlngsResults[result.origin] = result.duration;
  }

  latlngs.forEach(function(latlng) {
    console.log("Computing directions for latlng: " + JSON.stringify(latlng));
    getDirectionsCoords(latlng, saveResult);
  });

  function waitForDirections() {
    if (Object.keys(latlngsResults).length != latlngs.length) {
      console.log("Waiting again...");
      setTimeout(waitForDirections, 100);
    } else {
      console.log("All directions computed: ");
      console.log(latlngsResults);
      return;
    }
  }

  waitForDirections();
}

function getDirectionsString(address, sendResponse) {
  var request = {
    origin: address,
    destination: new google.maps.LatLng(mongoLatLng.lat, mongoLatLng.lng),
    travelMode: 'TRANSIT'
  };

  getDirections(request, sendResponse);
}

function getDirectionsCoords(latlng, sendResponse) {
  var request = {
    origin: new google.maps.LatLng(latlng.lat, latlng.lng),
    destination: new google.maps.LatLng(mongoLatLng.lat, mongoLatLng.lng),
    travelMode: 'TRANSIT'
  };

  getDirections(request, sendResponse);
}

function getDirections(request, sendResponse) {
  directions.route(request, function(result, status) {
    if (status == 'OK') {
      console.log("Got a response from directions API:");
      console.log(result);
      directionsResult = result;
      let directionsResp = {
        'duration': result.routes[0].legs[0].duration.text,
        'origin': request.origin,
        'dest': mongoLatLng,
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
