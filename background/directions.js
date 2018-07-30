'use strict';

/**
 * Gets directions for a Lat-Lng object.
 *
 * @param {object} latlng A Lat-Lng object containing latitude and longitude.
 * @param {string} ogAddress The address string corresponding to latlng.
 * @param {function} sendResponse A callback to run after the directions are
 *  fully computed.
 */
function getDirectionsCoords(latlng, ogAddress, sendResponse) {
  console.log('Computing directions to: ' + JSON.stringify(destLatLng));
  let request = {
    origin: new google.maps.LatLng(latlng.lat, latlng.lng),
    destination: new google.maps.LatLng(destLatLng.lat, destLatLng.lng),
    travelMode: 'TRANSIT',
  };

  getDirections(request, ogAddress, sendResponse);
}

/**
 * Gets directions for an address string.
 *
 * @param {object} request The Gmaps API request object for directions.
 * @param {string} address The address in question.
 * @param {function} sendResponse The callback to call once the directions are
 * computed.
 */
function getDirections(request, address, sendResponse) {
  let directionsResp = {
    'origin': request.origin,
    'address': address,
    'dest': destLatLng,
  };

  directions.route(request, function(result, statusStr) {
    if (statusStr == 'OK') {
      console.log('Got a response from directions API:');
      console.log(result);
      directionsResult = result;
      directionsResp.duration = result.routes[0].legs[0].duration.text;
      directionsResp.gmapsRes = result;
      sendResponse(directionsResp);
    } else {
      console.log('Failed to get directions due to: "' + statusStr + '".');
      if (statusStr == 'ZERO_RESULTS') {
        console.log('ZERO results found! Giving a "Not Available" response.');
        directionsResp.duration = 'Not Available';
        directionsResp.gmapsRes = null;
        sendResponse(directionsResp);
      } else if (statusStr == 'OVER_QUERY_LIMIT') {
        console.log('Reached query limit, retrying in 500 ms.');
        setTimeout(getDirections, 500, request, address, sendResponse);
        return;
      }
    }
  });
}

/**
 * Gets a LatLng object corresponding to an address string from the results sent
 * from GMaps geocode.
 *
 * @param {string} ogAddress The address string for which to produce a LatLng
 *  object.
 * @param {array} results The results sent back by GMaps geocode for ogAddress.
 * @param {string} statusStr The status of the GMaps geocode request that gave
 *  these results.
 * @return {object} Hopefully, the latlng object corresponding to ogAddress.
 */
function getLatLngFromGeocodeResult(ogAddress, results, statusStr) {
  let latlng = {
    'address': ogAddress,
    'valid': statusStr == 'OK',
  };

  if (statusStr == 'OK') {
    latlng.lat = results[0].geometry.location.lat();
    latlng.lng = results[0].geometry.location.lng();
  } else {/* Do nothing */}

  return latlng;
}

/**
 * Produce a message detailing the result of the geocode result for an
 * address.
 *
 * @param {object} latlng The latlng object constructed from the result of the
 *  GMaps geocode request.
 * @param {boolean} latlng.valid Whether or not the Geocode result gave us a
 *  successful lat-lng result.
 * @param {string} statusStr The status of the GMaps geocode request.
 * @return {string} A message concerning the result of our Geocode request.
 */
function createGeocodeMsg(latlng, statusStr) {
  if (latlng.valid) {
    return 'Geocode computed for ' + latlng.address + ': '
      + JSON.stringify(latlng);
  } else {
    return 'Geocode request for address: ' + latlng.address
      + ' failed due to "' + statusStr + '".';
  }
}

/* eslint-disable no-unused-vars */
/**
 * Geocodes a given address string.
 *
 * @param {string} address The address string to geocode into a LatLng object.
 * @param {function} sendResponse The callback to call once the Geocoding is
 *  done and the LatLng result is used to compute directions.
 */
function geocodeAddress(address, sendResponse) {
  geocoder.geocode({'address': address},
      function(results, statusStr) {
        console.log('For address: ' + address + ' got statusStr: ' + statusStr);
        if (statusStr == 'OVER_QUERY_LIMIT') {
          console.log('Reached query limit, retrying in 500 ms.');
          setTimeout(geocodeAddress, 500, address, sendResponse);
          return;
        }
        let latlng = getLatLngFromGeocodeResult(address, results, statusStr);
        let geocodeMsg = createGeocodeMsg(latlng, statusStr);
        console.log(geocodeMsg);
        getDirectionsCoords(latlng, address, sendResponse);
      }
  );
}
/* eslint-enable no-unused-vars */
