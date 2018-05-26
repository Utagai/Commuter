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
    if (request.building_address) {
      sendResponse({
        duration: "forever!"
      });
    }
  }
);
