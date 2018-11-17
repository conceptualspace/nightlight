// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

function save_options() {

    let whitelist = document.getElementById('whitelist').value.split("\n");
    let filteredWhitelist = [];

    for (let url of whitelist) {

        let site = '';

        if (url.indexOf("http://") === 0) {
            try {
                site = new URL(url).hostname;
                filteredWhitelist.push(site)
            }
            catch (err) {
            }
        } else if (url.indexOf("https://") === 0) {
            try {
                site = new URL(url).hostname;
                filteredWhitelist.push(site)
            }
            catch (err) {
            }
        } else {
            url = "https://" + url;
            try {
                site = new URL(url).hostname;
                filteredWhitelist.push(site)
            }
            catch (err) {
            }
        }
    }

    browser.storage.local.set({'whitelist': filteredWhitelist}, function() {
        let status = document.getElementById('status');
        status.textContent = 'Options saved!';

        document.getElementById('whitelist').value = filteredWhitelist.toString().replace(/,/g, '\n');

        setTimeout(function () {status.textContent = '';}, 2000);
    });
}

function restore_options() {
    browser.storage.local.get('whitelist', function(result) {
        document.getElementById('whitelist').value = result.whitelist.toString().replace(/,/g, '\n');
    })
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
