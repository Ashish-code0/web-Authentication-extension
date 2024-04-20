document.addEventListener('DOMContentLoaded', function() {
  // Check the authenticity of the current tab's website
  document.getElementById('checkCurrentTabButton').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var url = tabs[0].url;

      console.log(url);
      checkAuthenticity(url);
    });
  });
  
  // Check the authenticity of a manually entered website URL
  document.getElementById('checkButton').addEventListener('click', function() {
    var url = document.getElementById('urlInput').value;
    if (url.trim() !== '') {
      checkAuthenticity(url);
      url.value = '';
    } else {
      document.getElementById('status').innerHTML = 'Please enter a valid URL.';
    }
  });

  // Toggle popup size when button is clicked
  document.getElementById('toggleSizeButton').addEventListener('click', function() {
    togglePopupSize();
  });
});

function checkAuthenticity(url) {
  // Reset font color to red
  document.getElementById('status').style.color = 'red';

  // Perform the authenticity checks here
  if (url.startsWith('https://')) {
    document.getElementById('status').innerText = `This website uses a secure secure connection. URL: ${url}`;
    document.getElementById('status').style.color = '#007bff';
  } else {
    document.getElementById('status').innerText = 'This website does not use a secure connection. Proceed with caution.';
  }

  // Send a message to the background script to trigger checkUrlSafety()
  chrome.runtime.sendMessage({ action: 'checkUrlSafety', url: url}, function(response) {
    // Handle response from background script
    console.log(response);
  });

}





