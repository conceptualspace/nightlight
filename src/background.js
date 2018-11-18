// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

let status = "disabled";

browser.contextMenus.create({
    id: "whitelist-site",
    title: "Add site to whitelist",
    contexts: ["browser_action", "page"]
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
    let message = {response: "disabled"};
    browser.tabs.sendMessage(tab.id, message);

    // delay saving to whitelist to make sure nightlight is disabled on the tab first
    setTimeout(function() {
        browser.storage.local.get('whitelist', function (result) {
            let whitelist = result.whitelist;
            let site = new URL(tab.url).hostname;
            whitelist.push(site);
            browser.storage.local.set({'whitelist': Array.from(new Set(whitelist))});
        })
    }, 500);
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "isEnabled") {
        sendResponse({response: status});
    }
});

browser.browserAction.onClicked.addListener(function() {

    browser.tabs.query({}, function(tabs) {
        let message = {response: status};
        for (let i=0; i<tabs.length; ++i) {
            browser.tabs.sendMessage(tabs[i].id, message);
        }
    });

    if (status === "enabled") {
        if (browser.browserAction.setIcon) {
            browser.browserAction.setIcon({path: "icon" + 1 + ".png"});
        }
        status = "disabled";
    } else {
        if (browser.browserAction.setIcon) {
            browser.browserAction.setIcon({path: "icon" + 2 + ".png"});
        }
        status = "enabled";
    }

});
