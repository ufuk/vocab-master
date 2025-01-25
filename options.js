// Saves options to chrome.storage.
function saveOptions() {
    const newOptions = extractOptionsFromInputs();

    console.log("Options saving: ");
    console.log(newOptions);

    localStorage.setItem("hideMeaning", newOptions.hideMeaning);
    localStorage.setItem("vocabularyList", newOptions.vocabularyList);

    console.log('Options saved.');

    displayStatus("Options saved.");

    chrome.storage.sync.set({ period: newOptions.period, activated: newOptions.activated }, () => {
        // Send message to refresh alarm
        chrome.runtime.sendMessage({ message: "newOptionsSaved" }, function (response) {
            console.log(response.message);
        });
    });
}

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

// Restores settings using the stored data in chrome.storage.
function restoreOptions() {
    const $period = periodInput();
    const $activated = activatedInput();
    const $hideMeaning = hideMeaningInput();
    const $vocabularyList = vocabularyListSelect();

    console.log("Options restoring...");

    const options = {
        hideMeaning: localStorage.getItem("hideMeaning") === "true",
        vocabularyList: localStorage.getItem("vocabularyList") || "globish"
    };

    getAlarmOptions((optionsFromStorage) => {
        options.period = optionsFromStorage.period;
        options.activated = optionsFromStorage.activated;

        $period.val(options.period);
        $activated.prop('checked', options.activated);
        $hideMeaning.prop('checked', options.hideMeaning);

        $vocabularyList
            .find('option[value="' + options.vocabularyList + '"]')
            .attr('selected', true);

        console.log("Options restored: ");
        console.log(options);
    });
}

// Helper methods
function periodInput() {
    return $('input[name="period"]');
}

function activatedInput() {
    return $('input[name="activated"]');
}

function hideMeaningInput() {
    return $('input[name="hideMeaning"]');
}

function vocabularyListSelect() {
    return $('select[name="vocabularyList"]');
}

function extractOptionsFromInputs() {
    const $period = periodInput();
    const $activated = activatedInput();
    const $hideMeaning = hideMeaningInput();
    const $vocabularyList = vocabularyListSelect();

    return {
        period: parseInt($period.val()),
        activated: $activated.prop('checked'),
        hideMeaning: $hideMeaning.prop('checked'),
        vocabularyList: $vocabularyList.val()
    };
}

function displayStatus(statusText) {
    const $statusLabel = $('#statusLabel');
    $statusLabel.text(statusText);
    setTimeout(function () {
        $statusLabel.text('');
    }, 750);
}

// Set event bindings
document.addEventListener('DOMContentLoaded', restoreOptions);
$('input , select').change(saveOptions);
