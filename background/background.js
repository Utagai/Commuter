'use strict';

/**
 * The central background.js file for initialize extension-specific details,
 * such as supported pages and loading the maps API.
 *
 * @author may
 */

const aptSites = ['streeteasy.com', 'apartments.com', 'zillow.com'];

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: aptSites.map((x) =>
      new chrome.declarativeContent.PageStateMatcher({pageUrl: {hostSuffix: x}})
    ),
    actions: [new chrome.declarativeContent.ShowPageAction()],
  }]);
});

console.log('Commute time extension loaded.');
loadMapsAPI();
