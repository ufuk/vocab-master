chrome.runtime.onInstalled.addListener(function () {
    console.log("Extension installed.");
    chrome.runtime.openOptionsPage(function () {
        console.log("Options page opened.");
    });
});

// Browser action clicked
chrome.browserAction.onClicked.addListener(function () {
    console.log("Browser action clicked.");
});

// Blocking
chrome.webRequest.onBeforeRequest.addListener(
    function (requestDetails) {
        var isProperToIntercept = requestDetails.method == "GET" && requestDetails.url.indexOf("http") == 0;

        if (isProperToIntercept) {
            console.log(JSON.stringify(requestDetails));

            var options = {
                period: localStorage.getItem("period") || 0,
                activated: localStorage.getItem("activated") == "true",
                lastInterceptingTime: localStorage.getItem("lastInterceptingTime") || 0
            };

            if (!options.activated) {
                console.log('Reminder is not activated.');
                return;
            }

            if (options.period < 1) {
                console.log('Invalid period.');
                return;
            }

            if (options.lastInterceptingTime == 0) {
                localStorage.setItem("lastInterceptingTime", new Date().getTime());
                console.log('Last intercepting time initiated.');
                return;
            }

            var elapsedMillis = new Date().getTime() - options.lastInterceptingTime;
            var periodInMillis = options.period * 60 * 1000;

            console.log('Elapsed millis: ' + elapsedMillis + ' - ' + 'Period in millis: ' + periodInMillis);

            if (options.period > 0 && elapsedMillis > periodInMillis) {
                console.log('Intercepting for url: ' + requestDetails.url);

                var url = chrome.extension.getURL("intercepting-page.html");

                chrome.tabs.query({active: true, currentWindow: true}, function (tabDetails) {
                    var activeTabId = tabDetails[0].id;
                    console.log("Current tab's id: " + activeTabId);
                    Cookies.set("interceptedUrl" + activeTabId, requestDetails.url, {expires: 1});
                });

                localStorage.setItem("lastInterceptingTime", new Date().getTime());

                return {
                    redirectUrl: url
                };
            }
        }
    },
    {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    },
    ["blocking"]
);