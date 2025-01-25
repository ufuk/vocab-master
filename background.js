// When extension installed, open options page at once
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed.");

    chrome.runtime.openOptionsPage(function () {
        console.log("Options page opened.");
    });
});

// Get alarm options from Chrome Storage API
function getAlarmOptions(callback) {
    console.log("Getting options...");
    chrome.storage.sync.get({
        period: 5,
        activated: false
    }, function (options) {
        callback(options);
    });
}

// Create alarm
// Documentation for "chrome.alarms": https://developer.chrome.com/extensions/alarms
function createAlarm() {
    getAlarmOptions((options) => {
        chrome.alarms.clearAll(function () {
            console.log("Alarms cleared.");

            if (options && options.activated) {
                chrome.alarms.create("vocabReminder", { periodInMinutes: options.period });
                console.log("Alarm created.");
            }
        });
    });
}

createAlarm();

// Options page messages listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received: " + request.message);

    if (request.message === "newOptionsSaved") {
        createAlarm();
        sendResponse({ message: "alarmsReCreated" });
    }
});

// Alarm listener
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "vocabReminder") {
        try {
            await chrome.action.openPopup();
            console.log("Popup opened.");
        } catch (error) {
            // Ignored
        }
    }
});
