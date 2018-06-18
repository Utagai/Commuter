// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function addressChange(e) {
  e.preventDefault();
  console.log(e);
  console.log(e.srcElement);
  var formData = e.srcElement.children[0].value;
  chrome.storage.sync.set({ 'destAddress' : formData }, function() {
    console.log("Form data: " + formData);
    chrome.runtime.sendMessage({
      'source': "options",
      'type': "newDestAddress",
      'newAddress': formData
    },
    function() { console.log("Sent new address message to bg."); });
  });
  return false;
}

var addressForm = document.getElementById("addressForm");
addressForm.addEventListener("submit", addressChange);
