'use strict';

var geocoder;
var map;
var mongo_icon_url = "https://static.filehorse.com/icons/"
  + "developer-tools/mongodb-icon-32.png";

function initGmaps() {
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById('map'), {
    center: mongo_latlng,
    zoom: 15
  });

  marker = new google.maps.Marker(
    {
      position: mongo_latlng,
      icon: mongo_icon_url,
      map: map
    }
  );
}

loadMapsAPI();
