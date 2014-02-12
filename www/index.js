var driverExtensionId = "lcnailakdjhccbcepicgnekpemejahli";
var port;

function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('location-input')),
    { types: ['geocode'] });

  port = chrome.runtime.connect(driverExtensionId);
  if (port) {
    console.log("established port", port, driverExtensionId);
    port.onMessage.addListener(function(message) {
      if (message.location) {
        console.log("we are here!", message.location);
        $("#arrival-location").text(message.location);
        $("#arrived-modal").modal();
      }
    });
  } else {
    console.log("did not establish port");
  }
}

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude);
      autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
                                                          geolocation));
    });
  }
}
// [END region_geolocation]

function setLocation() {
  var location = $("#location-input").val();
  var message = {
    'location': location,
    'url': window.location.href  // that's not confusing at all
  };

  if (port) {
    port.postMessage(message);
  }
}

window.onload = function() {
  $("#location-input").focus(geolocate);
  $("#wake-button").click(setLocation);
  initialize();
};
