// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

browser.runtime.sendMessage({message: "isEnabled"}, function(response) {
    invert(response.response);
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    invert(request.response);
});

function invert(status) {
    let css = null;
    let bg = null;

    if (status === "enabled") {
        css = 'html {filter: invert(90%) hue-rotate(180deg);} ' +
            'img, canvas, embed, object, video, [style*="url"] {filter: hue-rotate(180deg) invert();}';
        bg = '#000000';

    } else {
        css ='html, img, canvas, embed, object, video, [style*="url"] {filter: none; } ';
        bg = 'initial';
    }

    // set the background immediately
    document.documentElement.style.backgroundColor = bg;

    let head = document.getElementsByTagName('head')[0];
    let style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);

    confirmInvert()
}

function confirmInvert() {
    // white text probably means we already had a dark background, so undo the inversion
    let textColor = window.getComputedStyle(document.body).color.match(/\d+/g);

    if ((textColor[0] > 200) && (textColor[1] > 200) && (textColor[2] > 200)) {

        let css ='html, img, canvas, embed, object, video, [style*="url"] {filter: none; } ';

        document.documentElement.style.backgroundColor = 'initial';

        let head = document.getElementsByTagName('head')[0];
        let style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }
}
