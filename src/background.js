// web extensions polyfill for ff/chrome
window.browser = (function () {
    return window.browser || window.chrome;
})();

const defaultWhitelist = [
    'alienwarearena.com',
    'animeonline.su',
    'app.getpocket.com',
    'app.keeweb.info',
    'app.plex.tv',
    'as2.aiae.ovh',
    'asciinema.org',
    'avengedsevenfold.com',
    'basho.com',
    'beastskills.com',
    'bing.com',
    'bitcoinwisdom.com',
    'blackle.com',
    'blacklemag.com',
    'blizzard.com',
    'bogleech.com',
    'broadcasthe.net',
    'bungie.net',
    'caniuse.com',
    'codepen.io',
    'codingame.com',
    'coinpot.co',
    'contrastrebellion.com',
    'cryptowat.ch',
    'cytu.be',
    'darkmodelist.com',
    'darkreader.org',
    'deltarune.com',
    'desktop.github.com',
    'destinytracker.com',
    'discordapp.com',
    'dota2.com',
    'dota2.ru',
    'dotabuff.com',
    'dotapicker.com',
    'draculatheme.com',
    'draftkings.com',
    'egee.io',
    'ego.mail.ru',
    'eternal.abimon.org',
    'fanatical.com',
    'ffmpeg.org',
    'filterblade.xyz',
    'flooxer.com',
    'frootvpn.com',
    'geektyper.com',
    'getsharex.com',
    'ggapp.io',
    'gidonline.in',
    'giphy.com',
    'glowing-bear.org',
    'gogoanime.se',
    'greenmangaming.com',
    'gunshipmusic.com',
    'hackaday.com',
    'hackertyper.com',
    'hardcoregaming101.net',
    'heapmedia.com',
    'heavybit.com',
    'humblebundle.com',
    'hyper.is',
    'i3wm.org',
    'illicoweb.videotron.com',
    'ingress.com',
    'inker.co',
    'isthereanydeal.com',
    'joeydrewstudios.com',
    'joinmastodon.org',
    'jsfiddle.net',
    'killtheradio.net',
    'kissmanga.com',
    'linux.org.ru',
    'lutris.net',
    'mmorpg.com',
    'mwomercs.com',
    'open.spotify.com',
    'opencritic.com',
    'opendota.com',
    'pathof.info',
    'pathofexile.com',
    'play.hbogo.com',
    'play.mubert.com',
    'pluralsight.com',
    'poe-racing.com',
    'poe.trade',
    'poeapp.com',
    'poelab.com',
    'pr0gramm.com',
    'primevideo.com',
    'raidtime.net',
    'realgamernewz.com',
    'runicgames.com',
    'serebii.net',
    'showtimeanytime.com',
    'shutov.by',
    'spacespacespaaace.space',
    'speedtest.net',
    'steamcommunity.com',
    'store.steampowered.com',
    'streamelements.com',
    'takethewalk.net',
    'tautulli.com',
    'telecineplay.com.br',
    'terminal.sexy',
    'totalwarwarhammer.gamepedia.com',
    'um.mos.ru',
    'undertale.com',
    'vakhtangov.ru',
    'vinesauce.com',
    'visualboxsite.com',
    'vuecinemas.nl',
    'weboas.is',
    'www.directvnow.com',
    'www.gdax.com',
    'www.gotimelinr.com',
    'www.netflix.com',
    'yande.re',
    'yandexdataschool.ru'
];

// initialize storage
browser.runtime.onInstalled.addListener(function() {
    browser.storage.local.get('whitelist', function (result) {
        if (!result.hasOwnProperty('whitelist')) { browser.storage.local.set({'whitelist': defaultWhitelist}) }
        else {
            browser.storage.local.get('whitelist', function(result) {
                let updatedWhitelist = defaultWhitelist.concat(result.whitelist);
                browser.storage.local.set({'whitelist': Array.from(new Set(updatedWhitelist))})
            })
        }
    });
});

let status = "disabled";

// context menus not supported on android
if (browser.contextMenus) {
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
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "isEnabled") {
        sendResponse({response: status});
    }
});

browser.browserAction.onClicked.addListener(function() {

    browser.tabs.query({}, function(tabs) {

        // bubble the active tab so it gets styled first; avoids potential delay with many tabs
        let sortedTabs = _.sortBy(tabs, 'active').reverse();
        let message = {response: status};
        for (let i=0; i<tabs.length; ++i) {
            browser.tabs.sendMessage(sortedTabs[i].id, message);
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
