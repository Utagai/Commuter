'use strict';

function getDirectionsMultiple(addresses, sendResponse) {
  let addressesResults = {}
  function saveResult(result) {
    console.log("Saving result for latlng: " + JSON.stringify(result.origin));
    addressesResults[result.address] = result.duration;
  }

  function computeDirections(i) {
    if (i >= addresses.length) { return; }
    console.log("Computing directions for address: " + JSON.stringify(addresses[i]));
    geocodeAddress(addresses[i], saveResult);
    setTimeout(function() { computeDirections(i+1); }, 400);
  }
  computeDirections(0);

  function waitForDirections() {
    if (Object.keys(addressesResults).length != addresses.length) {
      console.log("Waiting again...");
      setTimeout(waitForDirections, 100);
    } else {
      console.log("All directions computed: ");
      console.log(addressesResults);
      let resp = {
        'durations': addresses.map(function(address) {
          return addressesResults[address]
        }),
        'gmapsRes': addressesResults
      }
      console.log(resp);
      sendResponse(resp);
    }
  }

  waitForDirections();
}

function getDirectionsCoords(latlng, ogAddress, sendResponse) {
  var request = {
    origin: new google.maps.LatLng(latlng.lat, latlng.lng),
    destination: new google.maps.LatLng(mongoLatLng.lat, mongoLatLng.lng),
    travelMode: 'TRANSIT'
  };

  getDirections(request, ogAddress, sendResponse);
}

function getDirections(request, address, sendResponse) {
  let directionsResp = {
    'origin': request.origin,
    'address': address,
    'dest': mongoLatLng
  };

  directions.route(request, function(result, status) {
    if (status == 'OK') {
      console.log("Got a response from directions API:");
      console.log(result);
      directionsResult = result;
      directionsResp.duration = result.routes[0].legs[0].duration.text;
      directionsResp.gmapsRes = result;
    } else {
      console.log("Failed to get directions due to: '" + status + "'.");
      if (status == 'ZERO_RESULTS') {
        console.log("ZERO results found! Giving a nullish resp.");
        directionsResp.duration = 'N/A';
        directionsResp.gmapsRes = null;
      }
    }
    sendResponse(directionsResp);
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

function geocodeAddress(address, sendResponse) {
  geocoder.geocode({ 'address': address },
      function(results, status) {
        let latlng = getLatLngFromGeocodeResult(address, results, status);
        let geocodeMsg = createGeocodeMsg(latlng);
        console.log(geocodeMsg);
        getDirectionsCoords(latlng, address, sendResponse);
      }
  );
}
