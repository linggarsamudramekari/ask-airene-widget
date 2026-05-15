// widget.js (Upload this to your GitHub/CDN)

(function() {
    // 1. Get settings from the script tag that loaded this file
    const currentScript = document.currentScript || (function() {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    const widgetId = currentScript.getAttribute('data-widget-id') || 'default_id';
    const apiUrl = currentScript.getAttribute('data-api-url') || '';
    
    // Default Identify attributes (Gets from script tag, or uses default values)
    const defaultUserId = currentScript.getAttribute('data-visitor-user-id') || 'user_123';
    const defaultUserName = currentScript.getAttribute('data-visitor-name') || 'Jane Doe';
    const defaultUserEmail = currentScript.getAttribute('data-visitor-email') || 'jane@example.com';

    // 2. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #qontak-floating-btn {
            position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
            border-radius: 50%; background-color: #007bff; color: white; border: none;
            cursor: pointer; z-index: 999999; font-size: 24px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: transform 0.2s;
        }
        #qontak-floating-btn:hover { transform: scale(1.05); }
        #qontak-widget-iframe {
            position: fixed; bottom: 90px; right: 20px; width: 350px; height: 500px;
            border: none; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 999998; display: none; background: white; overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // 3. Create Button & Iframe
    const button = document.createElement('button');
    button.id = 'qontak-floating-btn';
    button.innerHTML = '💬'; 
    document.body.appendChild(button);

    const iframe = document.createElement('iframe');
    iframe.id = 'qontak-widget-iframe';
    
    // Set the iframe src to the URL you specified, passing ONLY the widget configurations
    let iframeUrl = `https://ai-gateway-fe.qontak.net/?widget_id=` + encodeURIComponent(widgetId);
    if (apiUrl) {
        iframeUrl += `&api_url=` + encodeURIComponent(apiUrl);
    }
    
    iframe.src = iframeUrl;
    
    document.body.appendChild(iframe);

    // 4. Toggle Logic
    let isOpen = false;
    button.addEventListener('click', function() {
        isOpen = !isOpen;
        iframe.style.display = isOpen ? 'block' : 'none';
        button.innerHTML = isOpen ? '✖' : '💬'; 
    });

    // ==========================================
    // 5. SECURE MESSAGE QUEUE SYSTEM
    // ==========================================
    let isIframeLoaded = false;
    let messageQueue = [];

    // When iframe finishes loading, process any messages waiting in the queue
    iframe.onload = function() {
        isIframeLoaded = true;
        while (messageQueue.length > 0) {
            const msg = messageQueue.shift();
            iframe.contentWindow.postMessage(msg, '*'); // Note: For high security, change '*' to 'https://ai-gateway-fe.qontak.net'
        }
    };

    // Helper to send or queue messages directly
    function dispatchToIframe(payloadData) {
        if (isIframeLoaded && iframe.contentWindow) {
            iframe.contentWindow.postMessage(payloadData, '*');
        } else {
            messageQueue.push(payloadData); // Save for later if iframe is still loading
        }
    }

    // ==========================================
    // 6. EXPOSE THE GLOBAL API
    // ==========================================
    window.QontakChat = {
        setContext: function(contextData) {
            console.log("[Widget JS SDK] Parent called setContext:", contextData);
            // Send the raw object exactly as the client passed it
            dispatchToIframe(contextData);
        },
        identify: function(userData) {
            const data = userData || {};
            
            // Merge passed data with attributes/defaults
            const finalUserData = {
                visitor_user_id: data.visitor_user_id || defaultUserId,
                visitor_name: data.visitor_name || defaultUserName,
                visitor_email: data.visitor_email || defaultUserEmail
            };
            
            console.log("[Widget JS SDK] Parent called identify:", finalUserData);
            // Send the raw object directly
            dispatchToIframe(finalUserData);
        }
    };

})();