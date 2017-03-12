var interceptedUrl = localStorage.getItem("interceptedUrl") || 'http://google.com';
localStorage.removeItem("interceptedUrl");

$(document).ready(function () {
    bindEvents();
    render();
});

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

function render() {
    var template =
        '<p class="word">{{word}}</p>' +
        '<p class="definition">{{definition}}</p>' +
        '{{translation}}' +
        '<p class="title">Example usages:</p>' +
        '<ul class="example-usages">' +
        '   {{examples}}' +
        '</ul>';

    if (vocabulary.globish.length == 0) {
        console.log("No vocabulary data! Redirecting directly to intercepted url...");
        goToInterceptedUrl();
        return;
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
        return;
    }

    var examplesContent = "";
    for (var i = 0; i < randomVocabulary.examples.length; i++) {
        examplesContent += '<li>' + randomVocabulary.examples[i] + '</li>';
    }

    var translationContent = "";
    var translation = randomVocabulary.definitions['turkish'];
    if (translation && translation.length > 0) {
        translationContent =
            '<p class="title">Click for meaning in Turkish:</p>' +
            '<p class="translation blurry-text">' + translation + '</p>';
    }

    var renderResult = template
        .replace('{{word}}', randomVocabulary.word)
        .replace('{{definition}}', randomVocabulary.definitions['english'])
        .replace('{{translation}}', translationContent)
        .replace('{{examples}}', examplesContent);

    $('div.container').append($(renderResult));

    $('.quote-container').show();
}

function goToInterceptedUrl() {
    window.location.href = interceptedUrl;
}
