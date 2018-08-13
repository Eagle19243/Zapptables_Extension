window.onload = function() {
    
}

/**
 * Function for Scrolling
 */
function scroll() {
    var main_area = $("#main .copyable-area");
    
    if (main_area.length == 0) return;

    var message_area = $("#main .copyable-area").children().get(2);

    scrollToEnd(message_area, function() {
        infiniteScrollToTop(main_area, message_area);
    });

    function scrollToEnd(el, cb) {
        if (!el) return;

        $(el).animate({ scrollTop: el.scrollHeight }, 1000, cb);
    }

    function scrollToTop(el, cb) {
        if (!el) return;

        $(el).animate({ scrollTop: 0 }, 500, cb);
    }

    function infiniteScrollToTop(main_area, message_area){
        // var last_is_loading = true;

        var timer = setInterval(function(){
            scrollToTop(message_area, function(){
                // var is_loading = ($(main_area.children().get(0)).children().length == 0) ? false: true;
                // if (!is_loading && !last_is_loading) {
                //     clearInterval(timer);
                // }
                // last_is_loading = is_loading;
            });
        }, 1000);
    }
}

/**
 * Function to retrieve media
 * @param {*} blob_link 
 */
function retrieveMedia(blob_link) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', blob_link, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        if (this.status == 200) {
            var uInt8Array = new Uint8Array(this.response);
            var i = uInt8Array.length;
            var binaryString = new Array(i);

            while (i--)
            {
                binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }

            var data = binaryString.join('');
            var base64 = window.btoa(data);

            sendMessage({
                action: "RETRIEVE_MEDIA", 
                data: "data:image/png;base64,"+base64
            });
        }
    };
    xhr.send();
}

/**
 * Helper to send message
 * @param {*} message 
 */
function sendMessage(message) {
    chrome.runtime.sendMessage(message);
}

/**
 * Message listener
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.action === "SCROLL") {
        scroll();
    } else if (request.action === "RETRIEVE_MEDIA") {
        retrieveMedia(request.blob_link);
    }
});