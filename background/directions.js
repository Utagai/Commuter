'use strict';

/* eslint-disable no-unused-vars */
/**
 * Gets commute times for multiple buildling addresses.
 *
 * @param {array} addresses The addresses for which to find commute times.
 * @param {callback} sendResponse The callback to call once this is done.
 */
function getDirectionsMultiple(addresses, sendResponse) {
  /* eslint-enable no-unused-vars */
  let addressesResults = {};

  /**
   * Saves the result into the addressesResults map when calle.d
   *
   * @param {object} result The result object, containing address and commute
   *  duration.
   */
  function saveResult(result) {
    console.log('Saving result for latlng: ' + JSON.stringify(result.origin));
    addressesResults[result.address] = result.duration;
  }

  /**
   * Computes directions (commute time) for the ith address.
   *
   * @param {number} i The ith address for which to compute directions.
   */
  function computeDirections(i) {
    if (i >= addresses.length) {
      return;
    }
    console.log('Computing directions for address: '
      + JSON.stringify(addresses[i]));
    geocodeAddress(addresses[i], saveResult);
    setTimeout(function() {
      computeDirections(i+1);
    }, 350);
  }
  computeDirections(0);

  /**
   * Stalls until all addresses have been computed, and if so, then crafts a
   * response and sends a response using sendResponse().
   */
  function waitForDirections() {
    if (Object.keys(addressesResults).length != addresses.length) {
      console.log('Waiting again...');
      setTimeout(waitForDirections, 100);
    } else {
      console.log('All directions computed: ');
      console.log(addressesResults);
      let resp = {
        'durations': addresses.map(function(address) {
          return addressesResults[address];
        }),
        'gmapsRes': addressesResults,
      };
      console.log(resp);
      sendResponse(resp);
    }
  }

  waitForDirections();
}

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

  directions.route(request, function(result, status) {
    if (status == 'OK') {
      console.log('Got a response from directions API:');
      console.log(result);
      directionsResult = result;
      directionsResp.duration = result.routes[0].legs[0].duration.text;
      directionsResp.gmapsRes = result;
    } else {
      console.log('Failed to get directions due to: \'' + status + '\'.');
      if (status == 'ZERO_RESULTS') {
        console.log('ZERO results found! Giving a nullish resp.');
        directionsResp.duration = 'N/A';
        directionsResp.gmapsRes = null;
      }
    }
    sendResponse(directionsResp);
  });
}

/**
 * Gets a LatLng object corresponding to an address string from the results sent
 * from GMaps geocode.
 *
 * @param {string} ogAddress The address string for which to produce a LatLng
 *  object.
 * @param {array} results The results sent back by GMaps geocode for ogAddress.
 * @param {string} status The status of the GMaps geocode request that gave
 *  these results.
 * @return {object} Hopefully, the latlng object corresponding to ogAddress.
 */
function getLatLngFromGeocodeResult(ogAddress, results, status) {
  let latlng = {
    'address': ogAddress,
    'valid': status == 'OK',
  };

  if (status == 'OK') {
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
 * @param {string} status The status of the GMaps geocode request.
 * @return {string} A message concerning the result of our Geocode request.
 */
function createGeocodeMsg(latlng, status) {
  if (latlng.valid) {
    return 'Geocode computed for ' + latlng.address + ': '
      + JSON.stringify(latlng);
  } else {
    return 'Geocode request for address: ' + latlng.address
      + ' failed due to \'' + status + '\'.';
  }
}

/**
 * Geocodes a given address string.
 *
 * @param {string} address The address string to geocode into a LatLng object.
 * @param {function} sendResponse The callback to call once the Geocoding is
 *  done and the LatLng result is used to compute directions.
 */
function geocodeAddress(address, sendResponse) {
  geocoder.geocode({'address': address},
      function(results, status) {
        let latlng = getLatLngFromGeocodeResult(address, results, status);
        let geocodeMsg = createGeocodeMsg(latlng, status);
        console.log(geocodeMsg);
        getDirectionsCoords(latlng, address, sendResponse);
      }
  );
}
