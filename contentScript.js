function inspectContent() {
    // Check for known phishing elements (e.g., fake login forms)
    const phishingActions = ['login', 'signin', 'authenticate', 'auth', 'account/login'];
    const phishingForms = Array.from(document.querySelectorAll('form')).filter(form => {
        const action = form.getAttribute('action');
        return phishingActions.some(actionString => action.includes(actionString));
    });
    if (phishingForms.length > 0) {
        alert('Warning: This page contains a potential phishing attempt (fake login form). Proceed with caution.');
    }
    
    // Check for suspicious scripts or iframes
    const suspiciousScripts = document.querySelectorAll('script[src*="malicious-script"]');
    if (suspiciousScripts.length > 0) {
        alert('Warning: This page contains suspicious scripts. Proceed with caution.');
    }

    // Check for known malware signatures in the page content
    const pageContent = document.documentElement.outerHTML;
    const malwareSignatures = ['malicious-pattern-1', 'malicious-pattern-2', 'malicious-pattern-3'];
    const foundMalware = malwareSignatures.some(signature => pageContent.includes(signature));
    if (foundMalware) {
        alert('Warning: This page contains known malware signatures. Proceed with caution.');
    }

    // Check for insecure content (e.g., HTTP content on HTTPS page)
    const insecureContent = document.querySelectorAll('[src^="http://"]');
    if (insecureContent.length > 0) {
        alert('Warning: This page contains insecure content (HTTP content on HTTPS page). Proceed with caution.');
    }

    // Check for potential clickjacking vulnerability
    const hasFrame = window.self !== window.top;
    if (hasFrame) {
        alert('Warning: This page may be vulnerable to clickjacking attacks. Proceed with caution.');
    }

    // Check for presence of autocomplete attribute on sensitive form fields
    const sensitiveInputs = document.querySelectorAll('input[type="password"], input[type="credit-card"]');
    sensitiveInputs.forEach(input => {
        if (input.hasAttribute('autocomplete')) {
            alert('Warning: This page may be exposing sensitive form fields to autocomplete. Proceed with caution.');
        }
    });

    // You can add more sophisticated inspection logic here...

}

// Run the content inspection when the page is fully loaded
window.addEventListener('load', inspectContent);
