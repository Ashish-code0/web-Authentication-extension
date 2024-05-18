// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
  console.log('AuthChecker extension installed/updated.');
});

// Listen for messages from the content scripts or popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  if (message.action === 'checkAuthenticity') {
    // Perform authenticity checks here
    const url = sender.tab.url;
    const authenticityResult = checkAuthenticity(url);

    // Send response back to the sender (content script or popup)
    sendResponse({ result: authenticityResult });
  }
});



chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

  if (message.action === 'checkAuthenticity') {
    // Perform authenticity checks here
    const url = sender.tab.url;
    const authenticityResult = checkAuthenticity(url);

    // Send response back to the sender (content script or popup)
    sendResponse({ result: authenticityResult });
  }
  else if (message.action === 'checkUrlSafety') {
    // Extract URL from the message
    const urlToCheck = message.url;

    // Call the checkUrlSafety function with the URL
    checkUrlSafety(urlToCheck)
      .then(result => {
        // Send response back to the popup script
        sendResponse(result);
      })
      .catch(error => {
        console.error("Error checking URL safety:", error);
        // Send an error response back to the popup script
        sendResponse({ error: error.message });
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
  else if (message.action === 'analyzeWebsiteSecurity') {
    // Extract domain from the message
    const domain = message.domain;
    // Call analyzeWebsiteSecurity function with the domain
    analyzeWebsiteSecurity(domain)
        .then(securityResult => {
            // Send the array response back to the content script or popup
            sendResponse(securityResult);
        })
        .catch(error => {
            console.error("Error analyzing website security:", error);
            // Send an error response back to the content script or popup
            sendResponse({ error: error.message });
        });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});



// Function to check the safety of a URL using Google Safe Browsing API
async function checkUrlSafety(url, callback) {

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

    const responseData = await response.json();
    
     if (responseData && responseData.matches && responseData.matches.length > 0) {
      console.log('running if in the checkUrl');
    } else {
      console.log("No security issues detected for URL:", url);
    }

    return responseData;
  }
  catch (error) {
    console.error("Error checking URL safety:", error);
  }
}



// background.js
async function fetchWhoisData(domain) {

  const whoisApiKey = 'at_szLCZbg7vcBph9SxwjBu5VA0XyBWU';
  const whoisApiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=${domain}&apiKey=${whoisApiKey}&outputFormat=json`;

  try {
      const response = await fetch(whoisApiUrl);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching WHOIS data:', error);
      return null;
  }
}




async function analyzeWebsiteSecurity(domain) {
  try {

      // Call fetchWhoisData to retrieve WHOIS data
      const whoisData = await fetchWhoisData(domain);
      console.log("Line no: 1 analyzeWebsiteSecurity")
      let safetyReasons = [];

      console.log("Line no: 2 analyzeWebsiteSecurity")
      // Check if WHOIS data is available
      if (whoisData) {
          // Extract relevant information from the WHOIS data
          const registrationDate = whoisData.WhoisRecord.createdDate;
          console.log("Line no: 3 analyzeWebsiteSecurity")
          console.log(`Registration Date : ${registrationDate}`);
          const registrar = whoisData.WhoisRecord.registrarName;
          console.log("Line no: 4 analyzeWebsiteSecurity")
          const location = whoisData.WhoisRecord.registrantCountry;
          console.log("Line no: 5 analyzeWebsiteSecurity")
          console.log(`Registrant Country : ${location}`)

          // Perform safety analysis based on extracted information
          let isSafe = true;
          console.log("Line no: 6 analyzeWebsiteSecurity")
          

          // Check registration date
          const currentDate = new Date();
          console.log("Line no: 7 analyzeWebsiteSecurity")
          const registrationDateTime = new Date(registrationDate);
          console.log("Line no: 8 analyzeWebsiteSecurity")
          const registrationAgeInDays = Math.floor((currentDate - registrationDateTime) / (1000 * 60 * 60 * 24));
          console.log("Line no: 9 analyzeWebsiteSecurity")
          if(registrationDate === undefined){
              isSafe = false;
              safetyReasons.push('The website has no creation date in whois details.');
              console.log("Line no: 10 analyzeWebsiteSecurity")
          }
          else if (registrationAgeInDays < 30) { // Adjust threshold as needed
              isSafe = false;
              safetyReasons.push('The website is newly registered.');
              console.log("Line no: 11 analyzeWebsiteSecurity")
          }

          if(registrar === undefined){
            isSafe = false;
            safetyReasons.push('The registrar information was not found.')
            console.log("Line no: 12 analyzeWebsiteSecurity")
          }
          else if(registrar != undefined && registrar.toLowerCase().includes('suspicious')){
             // Adjust criteria based on known bad registrars
              isSafe = false;
              safetyReasons.push('The registrar is associated with suspicious activity.');
              console.log("Line no: 13 analyzeWebsiteSecurity")
          }
          
          if(location === undefined){
              isSafe = false;
              safetyReasons.push('The registrant country is not known or is undefined in who is details. ');
              console.log("Line no: 14 analyzeWebsiteSecurity")
          }
          else if (location === 'High Risk Country') { // Adjust criteria based on known high-risk countries
              isSafe = false;
              safetyReasons.push('The registrant country is considered high risk.');
              console.log("Line no: 15 analyzeWebsiteSecurity")
          }
          // Console alert based on safety analysis
          if (isSafe) {
              console.log('The website appears to be safe to use.');
              console.log("Line no: 16 analyzeWebsiteSecurity")
          } 
          else {
              console.log('Warning: The website may not be safe to use. Reasons:');
              console.log("Line no: 17 analyzeWebsiteSecurity")
              safetyReasons.forEach(reason => {
                  console.log('- ' + reason);
              });
          }
      } else {
          console.error('WHOIS data not available');
          console.log("Line no: 18 analyzeWebsiteSecurity")
          // Handle the case where WHOIS data is not available
      }

      console.log("Line no: 19 analyzeWebsiteSecurity")

      return safetyReasons;
  } catch (error) {
      console.error('Error analyzing website security:', error);
      
  }
}



chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.type === "main_frame") {
      console.log("Page loaded:", details.url);
      console.log("SSL certificate:", details.securityInfo.certificates);
      // Implement SSL certificate validation logic here
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);


chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.type === "main_frame") {
      console.log("Page loaded:", details.url);
      console.log("SSL certificate:", details.securityInfo.certificates);
      // Implement SSL certificate validation logic here
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);




function isHTTPS(url) {
  return url.startsWith('https://');
}

