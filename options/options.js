// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function addressChange(e) {
  e.preventDefault();
  var newAddress = document.getElementById("address").value;
  var hint = document.getElementById("hint").value;
  var formData = { 'address' : newAddress, 'hint' : hint };
  console.log("New address: " + newAddress);
  console.log("Hint: " + hint);
  chrome.storage.sync.set(
    { 'destAddress' : formData, 'hint' : hint },
    function() {
      chrome.runtime.sendMessage(
        {
          'source': "options",
          'type': "newDestAddress",
          'newDest': formData
        },
        function() { console.log("Sent new address message to bg."); }
      );
    });
  return false;
}

var addressForm = document.getElementById("addressForm");
addressForm.addEventListener("submit", addressChange);
