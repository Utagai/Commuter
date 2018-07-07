'use strict';

/**
 * Contains logic regarding message passing between the apartment content
 * scripts and the extension.
 *
 * @author may
 */

let directionsResult;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Got a request from somewhere:');
    console.log(request);
    return dispatchMessage(request, sender, sendResponse);
  }
);

/**
 * Dispatches a message to the relevant message handling function for
 * processing.
 *
 * @param {object} request The request message.
 * @param {string} request.source The location of the extension from which the
 *  message was received.
 * @param {string} request.type The kind of information contained in the
 *  message (listing, listings, etc).
 * @param {object} sender The sender of the message.
 * @param {function} sendResponse A callback for the sender.
 * @return {boolean} signifying to Chrome that the response will be sent async.
 */
function dispatchMessage(request, sender, sendResponse) {
  if (request.source === 'popup') {
    console.log('Current directions Result: ');
    console.log(directionsResult);
    sendResponse(directionsResult);
  } else {
    directionsResult = null; // Clear directions result if needed.
    if (request.type === 'listing') {
      let listingAddress = request.addressInfo;
      processListingAddrMsg(request, sender, sendResponse, listingAddress);
    } else if (request.type === 'listings') {
      let listingAddresses = request.addressInfo;
      processListingsMsg(request, sender, sendResponse, listingAddresses);
    } else if (request.type === 'newDestAddress') {
      processNewDestAddressMsg(request, sender);
    } else {
      let unknownErr = new Error('Could not recognize request type: '
        + request.type);
      throw unknownErr;
    }
    return true; // Asynchronous response will be given later.
  }
}

/**
 * Handle a new destination address for commute time and directions calculation.
 *
 * @param {object} request The request message.
 * @param {object} request.newDest The location of the new destination.
 * @param {string} request.newDest.address The address of the new destination.
 * @param {string} request.newDest.hint A hint (usually a state/province).
 * @param {object} sender The sender of the message.
 */
function processNewDestAddressMsg(request, sender) {
  console.log('Got a new dest message:');
  console.log(request);
  let address = request.newDest.address;
  let hint = request.newDest.hint;
  geocoder.geocode(
    {'address': address},
    function(results, status) {
      destLatLng = getLatLngFromGeocodeResult(address, results, status);
      destAddr = address;
      destState = hint;
      chrome.storage.sync.set({'destLatLng': destLatLng}, function() {
        console.log('Set the new destLatLng as: ' + JSON.stringify(destLatLng));
      });
    }
  );
}

/**
 * Dispatches a message to the relevant message handling function for
 * processing.
 *
 * @param {object} request The request message.
 * @param {object} sender The sender of the message.
 * @param {function} sendResponse A callback for the sender.
 * @param {string} address The address of the listing in question.
 */
function processListingAddrMsg(request, sender, sendResponse, address) {
  if (address) {
    geocodeAddress(address, sendResponse);
  } else {/* Ignore this message. */}
}

/**
 * Dispatches a message to the relevant message handling function for
 * processing.
 *
 * @param {object} request The request message.
 * @param {object} sender The sender of the message.
 * @param {function} sendResponse A callback for the sender.
 * @param {array} addresses The address of the listing in question.
 */
function processListingsMsg(request, sender, sendResponse, addresses) {
  if (addresses.length > 0) {
    getDirectionsMultiple(addresses, sendResponse);
  } else {/* Ignore this message. */}
}
