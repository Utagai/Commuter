/**
 * Loaded when any StreetEasy URL is visited (including apartment pages).
 *
 * @author may
 */

function injectCommuteTime(response) {
  if (response) {
    console.log(response);
    let duration = response.duration;
    let titleElems = document.getElementsByClassName("incognito");
    for (let i = 0; i < titleElems.length; i++) {
      titleElems[i].innerText = titleElems[i].innerText + " (" + duration + ")";
    }
  }
}

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

function injectCommuteTimes(response) {
  if (response) {
    console.log(response);
    let durations = response.durations;
    let articleTitles = extractArticleTitles();
    for (let i = 0; i < durations.length; i++) {
      let titleTag = findTitleTag(articleTitles[i]);
      titleTag.innerText = "(" + durations[i] + ") " + titleTag.innerText;
      console.log("Title tag:");
      console.log(titleTag);
    }
  }
}

function extractBuildingAddress() {
  let infos = document.getElementsByClassName("backend_data BuildingInfo-item");
  if (infos.length == 0) { return null; }
  let buildingInfo = infos[0];
  let buildingAddress = buildingInfo.innerText;
  console.log("Building info found: " + buildingAddress);
  return buildingAddress
}

function extractArticleTitles() {
  let articles = Array.from(document.getElementsByTagName("article"));
  return articles.map(function(article) {
    let articleChildren = Array.from(article.childNodes);
    return articleChildren.filter(function(child) {
      return child.className == "details row";
    })[0];
  });
}

function extractBuildingAddresses() {
  let listingsContainer = document.getElementsByClassName("left-two-thirds "
    + "items item-rows listings");
  if (listingsContainer.length == 0) { return []; }
  return extractArticleTitles().map(function(articleTitle) {
    return findTitleTag(articleTitle).innerText + ", " + hint;
  });
}

function reportBuildingPage(buildingAddress, callback) {
  chrome.runtime.sendMessage(
    {
      'source': "streateasy",
      'type': "building",
      'addressInfo': buildingAddress
    },
    callback
  );
}

function reportListingsPage(buildingAddresses, callback) {
  chrome.runtime.sendMessage(
    {
      'source': "streateasy",
      'type': "listings",
      'addressInfo': buildingAddresses
    },
    callback
  );
}

function run() {
  let buildingAddress = extractBuildingAddress();
  if (buildingAddress) {
    console.log("Found a building page!");
    reportBuildingPage(buildingAddress, injectCommuteTime);
  } else {
    let buildingAddresses = extractBuildingAddresses();
    console.log(buildingAddresses);
    if (buildingAddresses.length > 0) {
      reportListingsPage(buildingAddresses, injectCommuteTimes);
    } else { console.log("Not a building or listings page."); }
  }
}

run();
