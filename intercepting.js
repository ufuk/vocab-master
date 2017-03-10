setTimeout(function () {
    chrome.storage.local.get('interceptedUrl', function (result) {
        window.location.replace(result.interceptedUrl);
    });
}, 5000);
