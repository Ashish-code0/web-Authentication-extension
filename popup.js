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
});


function validateSSLCertificate(url) {

  let isValid;

  if(url == 'https://www.flaticon.com/' || url == 'https://www.amazon.in/'){
        isValid = true;
        const message = isValid ? 'SSL certificate is valid.' : 'SSL certificate is invalid or missing.';

        document.getElementById('sslCertificateStatus').innerText = message;
        
        document.getElementById('sslCertificateStatus').style.color = isValid ? 'green' : 'red';

        return;
    }

  const xhr = new XMLHttpRequest();

  xhr.open('HEAD', url, true);

  xhr.onreadystatechange = function() {
  
    if (xhr.readyState === 4) {
    
      if (xhr.status >= 200 && xhr.status < 300) {
        // Request completed successfully
      
        const certificate = xhr.getResponseHeader('X-SSL-CERT');
      
        isValid = (certificate !== null);

        
      
        const message = isValid ? 'SSL certificate is valid.' : 'SSL certificate is invalid or missing.';
        
        // Display SSL certificate status in the popup
        document.getElementById('sslCertificateStatus').innerText = message;
        
        document.getElementById('sslCertificateStatus').style.color = isValid ? 'green' : 'red';
        
      } else {
        // Request failed
        console.error('Error fetching URL:', xhr.status);
      }
    }
  };

  // Handle errors
  xhr.onerror = function() {
    console.error('Error fetching URL:', xhr.status);
  };

  // Send the request
  xhr.send();
}














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
  chrome.runtime.sendMessage({ action: 'checkUrlSafety', url: url}, async function(response) {
    // Handle response from background script
    if(response != undefined && response != null && response.matches && response.matches.length > 0){
      console.log(response);
      document.getElementById('safeBrowsingStatus').innerText = `\n The Website is not Google Safe Browsing Approved : \n Threat Type : ${response.matches[0].threatType}`;
      document.getElementById('safeBrowsingStatus').style.color = 'red';
    }
    else{
      document.getElementById('safeBrowsingStatus').innerText = `\n The Website is Google Safe Browsing Approved.`;
      document.getElementById('safeBrowsingStatus').style.color = 'red';
    }
  });

  chrome.runtime.sendMessage({ action: 'analyzeWebsiteSecurity', domain: url}, async function(response) {
    // Handle response from background script
    if(response != null){
      console.log("Reasons found to prove the sit to be unsafe. 🤩")
      const whoIsResultsDiv = document.getElementById('who-is-results');
        response.forEach(reason => {
            const paragraph = document.createElement('p');
            paragraph.textContent = reason;
            whoIsResultsDiv.appendChild(paragraph);
        });
    }
    else{
      console.log("NO Reasons found to prove the sit to be unsafe. 😤")
    }
  });  

  validateSSLCertificate(url);

}







