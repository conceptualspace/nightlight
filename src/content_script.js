chrome.runtime.sendMessage({message: "isEnabled"}, function(response) {
    invert(response.response);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    invert(request.response);
});

var bgBlack = document.documentElement.style.backgroundColor || 'black';
var bgWhite = document.documentElement.style.backgroundColor || 'white';

function invert(status) {
    if (status === "enabled") {
        document.documentElement.style.backgroundColor = bgBlack;
        document.documentElement.style.filter = "hue-rotate(180deg) invert(100%)";
        //document.body.style.backgroundColor = "white";
        //document.body.style.backgroundColor = "rgba(0,0,0,0.9)";
    } else {
        document.documentElement.style.backgroundColor = bgWhite;
        document.documentElement.style.filter = "hue-rotate(0deg) invert(0%)";
        //document.body.style.backgroundColor = initialBackgroundColor;
    }
}
