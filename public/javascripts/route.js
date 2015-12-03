(function(){

  var map, lines = [], markers = {}, route = [];

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
  }

  function clear() {
    // clear
    for (var mark in markers) {
      markers[mark].setMap(null);
    }
    markers = {};
    for (var i = 0; i < lines.length; i++) {
      lines[i].setMap(null);
    }
    lines = [];
  };

  function getData () {

    // limit
    var cnt = $('#cnt')[0].value;
    var zoom = map.getZoom();
    if (zoom < 15 && cnt < 10) {
      return;
    }
    var url;

    var latlng = map.getBounds();
    var sw = latlng.getSouthWest();
    var ne = latlng.getNorthEast();

    clear();

    // shop data
    url = "/map/route/shop/area"
            + "?sw=" + sw.lat() + "," + sw.lng()
            + "&ne=" + ne.lat() + "," + ne.lng()
    $.get(url, function(data) {

      var marker, sid;
      for (var i = 0; i < data.length; i++) {
        sid = data[i].store_id;

        if (markers[sid]) {
          continue;
        }

        marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(data[i].store_point.lat, data[i].store_point.lon),
          title: data[i].store_id.toString()
        });

        google.maps.event.addListener(marker, "dblclick", function() {
          var url = "/map/route/shop/" + this.getTitle() + '?cnt=' + cnt;

          // push
          route.push(new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng()),
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }));

          clear();

          $.get(url, function(data) {
            drawRoute(data);
          });
        });

        markers[sid] = marker;
      }
    });


    // api
    url = '/map/route/data'
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

  function drawRoute(data) {

    var marker, sid, label;
    for (var i = 0; i < data.length; i++) {

      sid = data[i].end_store;
      label = i < 9 ? i + 1 : " ";

      marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(data[i].end_point.lat, data[i].end_point.lon),
        label: { text: label.toString() },
        title: data[i].end_store.toString()
      });

      google.maps.event.addListener(marker, "dblclick", function() {
        
        route.push(new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng()),
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }));

        var before = route[route.length - 2];
        var after  = route[route.length - 1];

        new google.maps.Polyline({
          map: map,
          path: [
            new google.maps.LatLng(before.getPosition().lat(), before.getPosition().lng()),
            new google.maps.LatLng(after.getPosition().lat(), after.getPosition().lng()),
          ],
          strokeColor: "blue",
          strokeWeight: 3
        });

        clear();

        var cnt = $('#cnt')[0].value;
        var url = "/map/route/shop/" + this.getTitle() + "?cnt=" + cnt;
        $.get(url, function(data) {
          drawRoute(data);
        });
      });

      lines.push(
        new google.maps.Polyline({
          map: map,
          path: [
            new google.maps.LatLng(data[i].start_point.lat, data[i].start_point.lon),
            new google.maps.LatLng(data[i].end_point.lat, data[i].end_point.lon)
          ],
          strokeColor: "blue",
          strokeWeight: 1
        })
      );

     markers[sid] = marker;
    }
  }

  $("#reload").on("click", function() {
    getData();
  });
  
  init();
  setTimeout(getData, 3000);
})();
