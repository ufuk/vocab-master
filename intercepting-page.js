// Get intercepted URL
var interceptedUrl = localStorage.getItem("interceptedUrl") || 'http://google.com';
localStorage.removeItem("interceptedUrl");

// Decide vocabulary
if (vocabulary.globish.length == 0) {
    console.log("No vocabulary data! Redirecting directly to intercepted url...");
    goToInterceptedUrl();
}

var randomVocabulary = {};
var retryCount = 0;
var isProperToShow = false;
do {
    if (retryCount > 10) {
        break;
    }
    retryCount++;

    var randomIndex = Math.floor((Math.random() * vocabulary.globish.length));
    randomVocabulary = vocabulary.globish[randomIndex];
    var definition = randomVocabulary.definitions && randomVocabulary.definitions['english'];
    isProperToShow = definition && randomVocabulary.definitions['english'].trim().length > 0;
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
        examplesContent += '<li>' + randomVocabulary.examples[i] + '</li>';
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

    // Render the sticky
    var stickyTemplate =
        '<p class="word">{{word}}</p>' +
        '<p class="definition">{{definition}}</p>' +
        '{{translation}}' +
        '{{examples}}';

    var renderingResult = stickyTemplate
        .replace('{{word}}', randomVocabulary.word)
        .replace('{{definition}}', randomVocabulary.definitions['english'])
        .replace('{{translation}}', translationContent)
        .replace('{{examples}}', examplesContent);

    $('div.container').append($(renderingResult));

    $('.quote-container').show();
}

function goToInterceptedUrl() {
    window.location.href = interceptedUrl;
}
