'use strict';

/**
 * An event-handling function for an address change made on the options page.
 *
 * Changes the address of the 'office' or whatever 'home' is in reference to the
 * apartments found on sites.
 *
 * @param {event} e The event corresponding to the address information change.
 * @return {boolean} Always returns false to avoid default form submission
 *  behavior.
 */
function addressChange(e) {
  e.preventDefault();
  let newAddress = document.getElementById('address').value;
  let hint = document.getElementById('hint').value;
  let formData = {'address': newAddress, 'hint': hint};
  console.log('New address: ' + newAddress);
  console.log('Hint: ' + hint);
  chrome.storage.sync.set(
    {'destAddress': formData, 'hint': hint},
    function() {
      chrome.runtime.sendMessage(
        {
          'source': 'options',
          'type': 'newDestAddress',
          'newDest': formData,
        },
        function() {
          console.log('Sent new address message to bg.');
        }
      );
    });
  return false;
}

let addressForm = document.getElementById('addressForm');
addressForm.addEventListener('submit', addressChange);
