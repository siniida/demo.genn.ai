(function(){

  var map = null, before = {}, after = {};

  var initPlace = {
    lat: 35.658676,
    lng: 139.701950
  };
  var baseUrl = "/map/data";

  function init () {
    var canvas, latlng, mapOptions, place, point;

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
      minZoom: 16,
      center: latlng
    };

    map = new google.maps.Map(canvas, mapOptions);

    google.maps.event.addListener(map, "zoom_changed", function () {
      getData();
    });
  }

  function getData () {
    var latlng = map.getBounds();
    var sw = latlng.getSouthWest();
    var ne = latlng.getNorthEast();

    // api
    var url = baseUrl + '?sw=' + sw.lat() + ',' + sw.lng() + '&ne=' + ne.lat() + ',' + ne.lng();
    $.get(url, function(data) {

      var opt, opa;

      for (var i = 0; i < data.length; i++) {

        opa = data[i].cnt / 100 + 0.3 > 1 ? 1.0 : data[i].cnt / 100 + 0.3;

        opt = {
          map: map,
          center: new google.maps.LatLng(data[i].point.lat, data[i].point.lon),
          radius: 10,
          strokeWeight: 0,
          fillColor: "#FF0000",
          fillOpacity: opa
        };

        after[data[i]._id] = data[i];
        if (data[i]._id in before) {
          if (before[data[i]._id].cnt == data[i].cnt) {
            after[data[i]._id].map = before[data[i]._id].map;
            delete(before[data[i]._id]);
          } else {
            after[data[i]._id].map = new google.maps.Circle(opt);
          }
        } else {
          after[data[i]._id].map = new google.maps.Circle(opt);
        }
      }

      // delete
      for (var point in before) {
        before[point].map.setMap(null);
      }

      // switch
      before = after;
      after = {};
    });
  }
  
  init();
  setInterval(getData, 5000);
})();
