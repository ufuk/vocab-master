// Get excluded words list (contains hash codes)
var excludedList = JSON.parse(localStorage.getItem("excludedList") || "[]");
var vocabularyListOption = localStorage.getItem("vocabularyList") || "globish";

// Decide vocabulary
var selectedVocabularyList = vocabulary[vocabularyListOption];

if (selectedVocabularyList.length == 0) {
    console.log("No vocabulary data! Redirecting directly to intercepted url...");
    goToInterceptedUrl();
}

var randomVocabulary = {};
var retryCount = 0;
var isProperToShow = false;
do {
    if (retryCount == 13) { // Lucky 13
        break;
    }
    retryCount++;

    var randomIndex = Math.floor((Math.random() * selectedVocabularyList.length));
    randomVocabulary = selectedVocabularyList[randomIndex];
    var definition = randomVocabulary.definitions && randomVocabulary.definitions['english'];
    isProperToShow = definition && randomVocabulary.definitions['english'].trim().length > 0 && excludedList.indexOf(JSON.hashCode(randomVocabulary)) == -1;
    if (!isProperToShow) {
        console.log("Vocabulary was not proper to show: " + JSON.stringify(randomVocabulary));
    }
} while (!isProperToShow);

if (!isProperToShow) {
    console.log("No proper vocabulary found to show after lots of trying! Redirecting directly to intercepted url...");
    goToInterceptedUrl();
}

// Prepare UI if vocabulary proper to display
if (isProperToShow) {
    $(document).ready(function () {
        bindEvents();
        renderSticky();
    });
}

function bindEvents() {
    $(document).on('click', '.blurry-text', function () {
        $(this).removeClass('blurry-text');
    });

    $('.show-again').click(function () {
        goToInterceptedUrl();
    });

    $('.do-not-show-again').click(function () {
        excludedList.push(JSON.hashCode(randomVocabulary));
        localStorage.setItem("excludedList", JSON.stringify(excludedList));
        goToInterceptedUrl();
    });
}

function renderSticky() {
    // Render examples part
    var examplesContent = "";
    var examplesTemplate =
        '<p class="title">Example usages:</p>' +
        '<ul class="example-usages">' +
        '   {{examples}}' +
        '</ul>';
    for (var i = 0; i < randomVocabulary.examples.length; i++) {
        var example = randomVocabulary.examples[i].trim();
        if (example.length > 0) {
            examplesContent += '<li>' + example + '</li>';
        }
    }
    if (examplesContent && examplesContent != "") {
        examplesContent = examplesTemplate.replace("{{examples}}", examplesContent);
    }

    // Render translation part
    var translationContent = "";

    var translation = randomVocabulary.definitions['turkish'];
    if (translation && translation.length > 0) {
        translationContent =
            '<p class="title">Click for meaning in Turkish:</p>' +
            '<p class="translation blurry-text">' + translation + '</p>';
    }
    
    //hide definition if enabled
    var blurred = localStorage.getItem("blurredText") == 'true' ? 'blurry-text' : '' ;
    
    // Render the sticky
    var stickyTemplate =
        '<p class="word">{{word}}</p>' +
        '<div class="wrap {{blurred}}">' +
        '<p class="definition">{{definition}}</p>' +
        '{{translation}}' +
        '{{examples}}' +
        '</div>';

    var renderingResult = stickyTemplate
        .replace('{{word}}', randomVocabulary.word)
        .replace('{{definition}}', randomVocabulary.definitions['english'])
        .replace('{{translation}}', translationContent)
        .replace('{{blurred}}', blurred)
        .replace('{{examples}}', examplesContent);

    $('div.container').append($(renderingResult));
    
    $('.quote-container').show();
}

function goToInterceptedUrl() {
    var interceptedUrl = window.location.search.replace('?url=', '').trim();
    if (interceptedUrl.length == 0) {
        interceptedUrl = 'http://google.com';
    }
    window.location.href = interceptedUrl;
}
