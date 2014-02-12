function handleMessage(e) {
  $("#location").val(e.data.location);
  $("#url").val(e.data.url);
}

function arrived() {
  window.open($("#url").val());
  window.setTimeout(function() {
    var message = {
      'location': $("#location").val()
    };
    chrome.runtime.sendMessage(message, function(response) {
      console.log('sent', response);
    });
  }, 2000);
}

window.onload = function() {
  window.addEventListener("message", handleMessage, false);
  $("#arrived").click(arrived);
};
