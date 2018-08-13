window.onload = function() {
    initEventHandler();
}

/**
 * Event Handler
 */
function initEventHandler() {
    $(".btn-scroll").click(function(){
        sendMessage({action: 'SCROLL'});
    });

    $(".btn-retrieve-media").click(function(){
        sendMessage({action: 'RETRIEVE_MEDIA', blob_link: $("#blob_link").val()});
    });
}

/**
 * Update image
 * @param {*} data 
 */
function updateImage(data) {
    $("#img_from_blob").attr("src", data);
    $("#img_from_blob").show();
}

/**
 * Helper to send message
 * @param {*} message 
 */
function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if (!tabs[0].url.includes("web.whatsapp.com")) {
            return;
        }
        
        chrome.tabs.sendMessage(tabs[0].id, message, function(response){
        });

    });
}

/**
 * Message listener
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.action === "RETRIEVE_MEDIA") {
        updateImage(request.data);
    }
});

