// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
  console.log('AuthChecker extension installed/updated.');
});

// Listen for messages from the content scripts or popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  console.log("Called from cehckAuthenticity background.js");
  if (message.action === 'checkAuthenticity') {
    // Perform authenticity checks here
    const url = sender.tab.url;
    const authenticityResult = checkAuthenticity(url);

    // Send response back to the sender (content script or popup)
    sendResponse({ result: authenticityResult });
  }
});


// Example function to check if a URL uses HTTPS

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Called form OnMessage")
  if (message.action === 'checkUrlSafety') {
    // Extract URL from the message
    const urlToCheck = message.url;

    // Call the checkUrlSafety function with the URL
    checkUrlSafety(urlToCheck, function (result) {
      // Send response back to the popup script
      sendResponse(result);
    });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});



// Function to check the safety of a URL using Google Safe Browsing API
async function checkUrlSafety(url, callback) {

  console.log("Called from checkUrlSafety");
  console.log(`${url}`)
  const apiKey = 'AIzaSyA94auGHxIx0_84_8YyyYgvJ1IH96-98pQ';
  const apiUrl = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

  const requestData = {
    client: {
      clientId: '285183506851-qu05vggddf9v03qq7phmuu8e1qcn0n4v.apps.googleusercontent.com',
      clientVersion: '1.0'
    },
    threatInfo: {
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url: url }]
    }
  };

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (response && response.matches && response.matches.length > 0) {
      // If matches are found, handle the security issue
      console.log("Security issue detected for URL:", url);
      response.matches.forEach(match => {
        console.log("Threat type:", match.threatType);
        console.log("Platform type:", match.platformType);
        console.log("Threat entry type:", match.threatEntryType);
      });
    } else {
      console.log("No security issues detected for URL:", url);
    }
  }
  catch (error) {
    console.error("Error checking URL safety:", error);
  }
}




function isHTTPS(url) {
  console.log("Called from isHTTPS");
  return url.startsWith('https://');
}

