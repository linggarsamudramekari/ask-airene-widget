// widget.js (Ready for CDN)

(function() {
    // 1. Get the Auth Cookie from the parent site
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    const authToken = getCookie('chat_sso_token');

    // --- DEBUGGING LOGS ---
    console.log("========== WIDGET DEBUG ==========");
    console.log("1. All readable parent cookies:", document.cookie);
    console.log("2. Extracted 'chat_sso_token':", authToken);
    console.log("==================================");

    // Fallback if token is null
    const finalToken = authToken || 'No_token_found';

    // 2. Inject CSS for the floating button and the iframe panel
    const style = document.createElement('style');
    style.innerHTML = `
        #my-floating-btn {
            position: fixed;
            bottom: 20px; /* Change to 'top: 20px;' for top placement */
            right: 20px;  /* Change to 'left: 20px;' for left placement */
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 999999;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        }
        #my-floating-btn:hover {
            transform: scale(1.05);
        }
        #my-widget-iframe {
            position: fixed;
            bottom: 90px; /* Change to 'top: 90px;' if button is at the top */
            right: 20px;  /* Change to 'left: 20px;' if button is on the left */
            width: 350px;
            height: 500px;
            border: none;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 999998;
            display: none;
            background: white;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    // 3. Create the Floating Button
    const button = document.createElement('button');
    button.id = 'my-floating-btn';
    button.innerHTML = '💬'; 
    document.body.appendChild(button);

    // 4. Create the Iframe Panel
    const iframe = document.createElement('iframe');
    iframe.id = 'my-widget-iframe';
    
    // Passing the token into the URL so your app can use it
    iframe.src = `https://ai-gateway-fe.qontak.net/?sso_token=` + encodeURIComponent(finalToken);
    
    document.body.appendChild(iframe);

    // 5. Add Click Logic to Toggle the Panel Open/Closed
    let isOpen = false;
    
    button.addEventListener('click', function() {
        isOpen = !isOpen;
        if (isOpen) {
            iframe.style.display = 'block';
            button.innerHTML = '✖'; 
        } else {
            iframe.style.display = 'none';
            button.innerHTML = '💬'; 
        }
    });

})();