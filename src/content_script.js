chrome.runtime.sendMessage({message: "isEnabled"}, function(response) {
    invert(response.response);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    invert(request.response);
});

var css = null;
var initialBackgroundColor = null;

function invert(status) {
    if (status === "enabled") {
        css = 'html {filter: invert(90%);} img {filter: invert(90%); }';
        initialBackgroundColor = document.body.style.backgroundColor || "initial";
        document.body.style.backgroundColor = "rgba(0,0,0,0.9)";
    } else {
        var css ='html {filter: invert(0%); } img {filter: invert(0%); }';
        document.body.style.backgroundColor = initialBackgroundColor;
    }

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    //injecting the css to the head
    head.appendChild(style);
}
