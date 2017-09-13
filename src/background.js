var status = "disabled";
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "isEnabled")
        sendResponse({response: status});
});

chrome.browserAction.onClicked.addListener(function() {

    chrome.tabs.query({}, function(tabs) {
        var message = {response: status};
        for (var i=0; i<tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, message);
        }
    });

    if (status === "enabled") {
        chrome.browserAction.setIcon({path: "icon" + 1 + ".png"});
        status = "disabled"
    } else {
        chrome.browserAction.setIcon({path: "icon" + 2 + ".png"});
        status = "enabled"
    }

});
