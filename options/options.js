// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function addressChange(e) {
  e.preventDefault();
  console.log(e);
  console.log(e.srcElement);
  var newAddress = e.srcElement.children[0].value;
  var hint = e.srcElement.children[2].value;
  var formData = { 'address' : newAddress, 'hint' : hint };
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
console.log("Options page opened.");
