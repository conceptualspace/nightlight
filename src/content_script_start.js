// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

browser.runtime.sendMessage({message: "isEnabled"}, function(response) {
    if (response.response === "enabled") {
        browser.storage.local.get('whitelist', function (result) {

            if (result && result.whitelist.includes(location.hostname)) {
                return;
            }

            document.documentElement.style.backgroundColor = '#000000';

            let css = 'html {filter: invert(90%) hue-rotate(180deg);}';
            let imgcss = 'html img, canvas, embed, object, video {filter: invert(90%) hue-rotate(180deg); }';
            let style = document.createElement('style');

            style.appendChild(document.createTextNode(''));
            document.documentElement.appendChild(style);
            style.sheet.insertRule(css, style.sheet.cssRules.length);
            style.sheet.insertRule(imgcss, style.sheet.cssRules.length);

        });
    }
});
