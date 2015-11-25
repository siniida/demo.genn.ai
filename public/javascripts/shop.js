(function(){

  var map = null;

  var initPlace = {
    lat: 36.00,
    lng: 139.00
  };

  function init () {
    var canvas, latlng, mapOptions, place, point;

    canvas = document.getElementById("map");
    latlng = new google.maps.LatLng(initPlace.lat, initPlace.lng);
    
    mapOptions = {
      zoom: 5,
      center: latlng
    };

    map = new google.maps.Map(canvas, mapOptions);
    getData();
  }

  function getData() {
    $.get("/map/shop/data", function(data) {
      console.log(data.length);
      for (var i = 0; i < data.length; i++) {
        new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(data[i].store_point.lat, data[i].store_point.lon)
        });
      }
    });
  }
  
  init();
})();
