var WIDTH = 480;
var HEIGHT = 320;

var appWindow;
var port;

var onCreate = function(window) {
  appWindow = window;
};

function handleSetLocation(location, url) {
  var message = {
    'location': location,
    'url': url
  };
  appWindow.contentWindow.postMessage(message, '*');
  // appWindow.contentWindow.locationField = request.location;
  // appWindow.contentWindow.urlField = sender.url;
  console.log("Will wake up", url, "at", location);
}

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  console.log("got", request, sender, response);
  port.postMessage(request);
});

chrome.runtime.onConnectExternal.addListener(function(localPort) {
  port = localPort;
  console.log("we are connected", port);
  port.onMessage.addListener(function(message) {
    if (message.location) {
      handleSetLocation(message.location, message.url);
    }
  });
});

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'frame': 'chrome',
    'width': WIDTH,
    'height': HEIGHT,
    'resizable': false
  }, onCreate);
});
