/**
 * Loaded when any StreetEasy URL is visited (including apartment pages).
 *
 * @author may
 */

function draw_duration(duration_resp) {
  let duration = duration_resp.duration;
  console.log("Duration of the trip is: " + duration);
}

function report(building_address, callback) {
  chrome.runtime.sendMessage(
			{
        building_address: building_address
      },
      function(response) {
  		  console.log(response);
		  }
      //callback
  );
}

function run() {
  let infos = document.getElementsByClassName("backend_data BuildingInfo-item");
  console.log(infos);

  if (infos.length > 0) {
    let building_info = infos[0];
    let building_address = building_info.innerText;
    console.log("Building info found: " + building_address);
    // If we got here, we are on an apartments page or something, and found an
    // address to give.
    report(building_address, draw_duration);
  } else {
    console.log("No building info found on page.");
    report(null, function() {});
  }
}

run();
