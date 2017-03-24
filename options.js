// Saves options to chrome.storage.
function saveOptions() {
    var newOptions = extractOptionsFromInputs();

    console.log("Options saving: ");
    console.log(newOptions);

    localStorage.setItem("period", newOptions.period);
    localStorage.setItem("activated", newOptions.activated);
    localStorage.setItem("blurredText", newOptions.blurredText);
    localStorage.setItem("vocabularyList", newOptions.vocabularyList);

    console.log('Options saved.');

    displayStatus("Options saved.");

    chrome.runtime.sendMessage({message: "newOptionsSaved"}, function (response) {
        // DO nothing for now
    });
}

// Restores settings using the stored data in chrome.storage.
function restoreOptions() {
    var $period = periodInput();
    var $activated = activatedInput();
    var $blurredText = meaningHideInput();
    var $vocabularyList = vocabularyListSelect();

    console.log("Options restoring...");

    var options = {
        period: localStorage.getItem("period") || 5,
        activated: localStorage.getItem("activated") == "true",
        blurredText: localStorage.getItem("blurredText") == "true",
        vocabularyList: localStorage.getItem("vocabularyList") || "globish"
    };

    $period.val(options.period);
    $activated.prop('checked', options.activated);
    $blurredText.prop('checked', options.blurredText);

    $vocabularyList
        .find('option[value="' + options.vocabularyList + '"]')
        .attr('selected', true);

    console.log("Options restored: ");
    console.log(options);
}

// Helper methods
function periodInput() {
    return $('input[name="period"]');
}

function activatedInput() {
    return $('input[name="activated"]');
}

function meaningHideInput() {
    return $('input[name="blurredText"]');
}

function vocabularyListSelect() {
    return $('select[name="vocabularyList"]');
}

function extractOptionsFromInputs() {
    var $period = periodInput();
    var $activated = activatedInput();
    var $blurredText = meaningHideInput();
    var $vocabularyList = vocabularyListSelect();

    return {
        period: parseInt($period.val()),
        activated: $activated.prop('checked'),
        blurredText: $blurredText.prop('checked'),
        vocabularyList: $vocabularyList.val()
    };
}

function displayStatus(statusText) {
    var $statusLabel = $('#statusLabel');
    $statusLabel.text(statusText);
    setTimeout(function () {
        $statusLabel.text('');
    }, 750);
}

// Set event bindings
document.addEventListener('DOMContentLoaded', restoreOptions);
$('input , select').change(saveOptions);
