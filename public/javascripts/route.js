(function(){

  var map = null, lines = [];

  var initPlace = {
    lat: 35.658676,
    lng: 139.701950
  };

  function init () {
    var canvas, latlng, mapOptions, styleOptions, place, point;

    place = location.search.substring(1).split("&");
    for (var i = 0; i < place.length; i++) {
      point = place[i].split("=");
      if (point[0] == "lat") {
        initPlace.lat = point[1];
      } else if (point[0] == "lng") {
        initPlace.lng = point[1];
      }
    }

    canvas = document.getElementById("map");
    latlng = new google.maps.LatLng(initPlace.lat, initPlace.lng);
    
    mapOptions = {
      zoom: 17,
      center: latlng,
      streetViewControl: false
    };

    map = new google.maps.Map(canvas, mapOptions);

    styleOptions = [{
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }, {
      featureType: "transit.station",
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    }];

    map.mapTypes.set("noText", new google.maps.StyledMapType(styleOptions));
    map.setMapTypeId("noText");

    google.maps.event.addListener(map, "zoom_changed", function () {
      getData();
    });
  }

  function getData () {

    // limit
    var cnt = $('#cnt')[0].value;
    var zoom = map.getZoom();
    if (zoom < 15 && cnt < 10) {
      return;
    }

    var latlng = map.getBounds();
    var sw = latlng.getSouthWest();
    var ne = latlng.getNorthEast();

    for (var i = 0; i < lines.length; i++) {
      lines[i].setMap(null);
    }

    lines = [];

    // api
    var url = '/map/route/data'
            + '?sw=' + sw.lat() + ',' + sw.lng()
            + '&ne=' + ne.lat() + ',' + ne.lng()
            + '&cnt=' + cnt;
    $.get(url, function(data) {
      console.log(data.length);
      var weight = 1;
      for (var i = 0; i < data.length; i++) {
        if (data[i].cnt > 10) {
          weight = 2;
/*
        } else if (data[i].cnt <= 10 && data[i] > 5) {
          weight = 2;
*/
        } else {
          weight = 1;
        }
        lines.push(
          new google.maps.Polyline({
            map: map,
            path: [
              new google.maps.LatLng(data[i].start_point.lat, data[i].start_point.lon),
              new google.maps.LatLng(data[i].end_point.lat, data[i].end_point.lon),
            ],
            strokeColor: "blue",
            strokeWeight: weight,
            strokeOpacity: 0.5
          })
        );
      }
    });
  }

  $("#reload").on("click", function() {
    getData();
  });
  
  init();
  setTimeout(getData, 3000);
})();
