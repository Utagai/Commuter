/**
 * Loaded when any StreetEasy URL is visited (including apartment pages).
 *
 * @author may
 */

/**
 * Injects commute times into the StreetEasy listing page.
 *
 * @param {object} response The result response from which to get the duration.
 */
function injectCommuteTime(response) {
  if (response) {
    console.log(response);
    let duration = response.duration;
    let titleElems = document.getElementsByClassName('incognito');
    for (let i = 0; i < titleElems.length; i++) {
      titleElems[i].innerText = titleElems[i].innerText + ' (' + duration + ')';
    }
  }
}

/**
 * Finds and returns the title tag corresponding to the listing title from the
 * page.
 *
 * @param {string} articleTitle The HTML element referring to the article
 *  element containing the title.
 * @return {HTMLElement} found title tag.
 */
function findTitleTag(articleTitle) {
  let titleDetails = Array.from(articleTitle.childNodes).filter(
    function(child) {
      return child.nodeName.toLowerCase() == 'h3';
    }
  )[0];

  return Array.from(titleDetails.childNodes).filter(function(child) {
    return child.nodeName.toLowerCase() == 'a';
  })[0];
}

/**
 * Injects multiple commute times into the StreetEasy listings (plural) page.
 *
 * See injectCommuteTime(response) for more information.
 *
 * @param {object} response The response containing the durations for all the
 *  listings in the page.
 */
function injectCommuteTimes(response) {
  if (response) {
    console.log(response);
    let durations = response.durations;
    let articleTitles = extractArticleTitles();
    for (let i = 0; i < durations.length; i++) {
      let titleTag = findTitleTag(articleTitles[i]);
      titleTag.innerText = '(' + durations[i] + ') ' + titleTag.innerText;
      console.log('Title tag:');
      console.log(titleTag);
    }
  }
}

/**
 * Extracts the human-readable string address of a listing from the page.
 *
 * @return {string} A string representing the address of the listing.
 */
function extractBuildingAddress() {
  let infos = document.getElementsByClassName('backend_data BuildingInfo-item');
  if (infos.length == 0) {
    return null;
  }
  let buildingInfo = infos[0];
  let buildingAddress = buildingInfo.innerText;
  console.log('Building info found: ' + buildingAddress);
  return buildingAddress;
}

/**
 * Extracts the article titles from the page and returns them.
 *
 * This runs for a listings (plural) page, and therefore finds all the articles
 * with address information in them.
 *
 * @return {HTMLElement} The article element.
 */
function extractArticleTitles() {
  let articles = Array.from(document.getElementsByTagName('article'));
  return articles.map(function(article) {
    let articleChildren = Array.from(article.childNodes);
    return articleChildren.filter(function(child) {
      return child.className == 'details row';
    })[0];
  });
}

/**
 * Extracts the building addresses from a series of article titles.
 *
 * @return {array} A series of building addresses that were extracted.
 */
function extractBuildingAddresses() {
  let listingsContainer = document.getElementsByClassName('left-two-thirds '
    + 'items item-rows listings');
  if (listingsContainer.length == 0) {
    return [];
  }
  return extractArticleTitles().map(function(articleTitle) {
    return findTitleTag(articleTitle).innerText + ', ' + hint;
  });
}

/**
 * Reports the extracted information gleaned from the listing (singular) page.
 *
 * @param {string} buildingAddress The address string of the listing.
 * @param {function} callback Call back function to call once the directions for
 *  the given buildingAddress has been computed.
 */
function reportBuildingPage(buildingAddress, callback) {
  chrome.runtime.sendMessage(
    {
      'source': 'streateasy',
      'type': 'building',
      'addressInfo': buildingAddress,
    },
    callback
  );
}

/**
 * Reports the extracted information gleaned from the listings (plural) page.
 *
 * @param {array} buildingAddresses An array of all building addresses found on
 *  listings page.
 * @param {function} callback The callback function to call once the directions
 *  for the various building addresses have been computed.
 */
function reportListingsPage(buildingAddresses, callback) {
  chrome.runtime.sendMessage(
    {
      'source': 'streateasy',
      'type': 'listings',
      'addressInfo': buildingAddresses,
    },
    callback
  );
}

/**
 * The entry point for this content-script to run on StreetEasy URLs.
 */
function run() {
  let buildingAddress = extractBuildingAddress();
  if (buildingAddress) {
    console.log('Found a building page!');
    reportBuildingPage(buildingAddress, injectCommuteTime);
  } else {
    let buildingAddresses = extractBuildingAddresses();
    console.log(buildingAddresses);
    if (buildingAddresses.length > 0) {
      reportListingsPage(buildingAddresses, injectCommuteTimes);
    } else {
      console.log('Not a building or listings page.');
    }
  }
}

run();
