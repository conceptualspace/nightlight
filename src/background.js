// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

var status = "disabled";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "isEnabled")
        sendResponse({response: status});
});

chrome.browserAction.onClicked.addListener(function() {

    browser.tabs.query({}, function(tabs) {
        var message = {response: status};
        for (var i=0; i<tabs.length; ++i) {
            browser.tabs.sendMessage(tabs[i].id, message);
        }
    });

    if (status === "enabled") {
        if (chrome.browserAction.setIcon) {
            chrome.browserAction.setIcon({path: "icon" + 1 + ".png"});
        }
        status = "disabled";
    } else {
        if (chrome.browserAction.setIcon) {
            chrome.browserAction.setIcon({path: "icon" + 2 + ".png"});
        }
        status = "enabled";
    }

});
