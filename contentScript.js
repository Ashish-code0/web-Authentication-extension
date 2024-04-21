// content.js

// Function to inspect the content of the web page
function inspectContent() {
    // Check for known phishing elements (e.g., fake login forms)
    alert("Content Inspection Is STARTING");
    const phishingForms = document.querySelectorAll('form[action*="login"]');
    if (phishingForms.length > 0) {
        alert('Warning: This page contains a potential phishing attempt (fake login form). Proceed with caution.');
    }
    

    // Check for suspicious scripts or iframes
    const suspiciousScripts = document.querySelectorAll('script[src*="malicious-script"]');
    if (suspiciousScripts.length > 0) {
        alert('Warning: This page contains suspicious scripts. Proceed with caution.');
    }

    // You can add more inspection logic here...

    // Example: Check for known malware signatures in the page content
    const pageContent = document.documentElement.outerHTML;
    const malwareSignatures = ['malicious-pattern-1', 'malicious-pattern-2', 'malicious-pattern-3'];
    const foundMalware = malwareSignatures.some(signature => pageContent.includes(signature));
    if (foundMalware) {
        alert('Warning: This page contains known malware signatures. Proceed with caution.');
    }
}

// Run the content inspection when the page is fully loaded
window.addEventListener('load', inspectContent);
