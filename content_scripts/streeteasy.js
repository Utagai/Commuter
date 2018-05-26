/**
 * Loaded when any StreetEasy URL is visited (including apartment pages).
 *
 * @author may
 */

function drawDuration(duration_resp) {
  let duration = duration_resp.duration;
  console.log("Duration of the trip is: " + duration);
}

function injectCommuteTime(response) {
  if (response) {
    console.log(response);
    let duration = response.duration;
    let titleElems = document.getElementsByClassName('incognito');
    for (let i = 0; i < titleElems.length; i++) {
      titleElems[i].innerText = titleElems[i].innerText + " (" + duration + ")";
    }
  }
}

function report(buildingAddress, callback) {
  chrome.runtime.sendMessage(
    {
      'source': 'streateasy',
      'buildingAddress': buildingAddress
    },
    injectCommuteTime
  );
}

function run() {
  let infos = document.getElementsByClassName("backend_data BuildingInfo-item");
  console.log(infos);

  if (infos.length > 0) {
    let buildingInfo = infos[0];
    let buildingAddress = buildingInfo.innerText;
    console.log("Building info found: " + buildingAddress);
    // If we got here, we are on an apartments page or something, and found an
    // address to give.
    report(buildingAddress, drawDuration);
  } else {
    console.log("No building info found on page.");
    report(null, function() {});
  }
}

run();
