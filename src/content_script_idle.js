// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

browser.runtime.sendMessage({message: "isEnabled"}, function(response) {
    if(response.response === "enabled") {
        browser.storage.local.get('whitelist', function (result) {
            if (result.whitelist.includes(location.hostname)) {
                return;
            }
            confirmInvert()
        });
    }
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    invert(request.response);
});

function invert(status) {

    browser.storage.local.get('whitelist', function(result) {
        if (result.whitelist.includes(location.hostname)) {
            return;
        }

        let css = null;
        let bg = null;
        let imgcss = null;
        let style = null;

        if (status === "enabled") {
            css = 'html {filter: invert(90%) hue-rotate(180deg);}';
            imgcss = 'html img, canvas, embed, object, video {filter: invert(90%) hue-rotate(180deg); }';
            bg = '#000000';
        } else {
            css ='html, html img, canvas, embed, object, video, [style*="url"] {filter: none; } ';
            bg = 'initial';
        }

        // set the background immediately
        document.documentElement.style.backgroundColor = bg;

        // update
        if (style) {
            style.sheet.cssRules[0].style.cssText = css;
        } else {
            style = document.createElement('style');
            style.appendChild(document.createTextNode(''));
            document.documentElement.appendChild(style);
            style.sheet.insertRule(css, style.sheet.cssRules.length);
            if (imgcss) {
                style.sheet.insertRule(imgcss, style.sheet.cssRules.length);
            }
        }

        confirmInvert()
    });

}

function confirmInvert() {
    // white text probably means we already had a dark background, so undo the inversion
    let textColor = window.getComputedStyle(document.body).color.match(/\d+/g);

    if ((textColor[0] > 200) && (textColor[1] > 200) && (textColor[2] > 200)) {
        let css ='html, img, canvas, embed, object, video, [style*="url"] {filter: none; } ';

        document.documentElement.style.backgroundColor = 'initial';

        let style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.documentElement.appendChild(style);
        style.sheet.insertRule(css, style.sheet.cssRules.length);
    }
}
