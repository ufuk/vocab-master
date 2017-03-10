// TODO: When extension installed, open options page at once
// chrome.runtime.onInstalled.addListener(function () {
//     console.log("Extension installed.");
//     chrome.runtime.openOptionsPage(function () {
//         console.log("Options page opened.");
//     });
// });

// Browser action clicked
chrome.browserAction.onClicked.addListener(function () {
    console.log("Browser action clicked.");
});

// Blocking
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        var isProperToIntercept = details.method == "GET" && details.url.indexOf("http") == 0;

        if (isProperToIntercept) {
            console.log(JSON.stringify(details));

            var intercept = false; // TODO: details.url.indexOf("expercise") != -1;
            if (intercept) {
                var url = chrome.extension.getURL("intercepting-page.html");

                chrome.storage.local.set({'interceptedUrl': details.url});

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