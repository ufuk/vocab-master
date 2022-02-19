// Get excluded words list (contains hash codes)
const excludedList = JSON.parse(localStorage.getItem("excludedList") || "[]");
const vocabularyListOption = localStorage.getItem("vocabularyList") || "globish";

// Decide vocabulary
const selectedVocabularyList = vocabulary[vocabularyListOption];

if (selectedVocabularyList.length === 0) {
    console.log("No vocabulary data! Redirecting directly to intercepted url...");
    goToInterceptedUrl();
}

let randomVocabulary = {};
let retryCount = 0;
let isProperToShow = false;
do {
    if (retryCount === 13) { // Lucky 13
        break;
    }
    retryCount++;

    const randomIndex = Math.floor((Math.random() * selectedVocabularyList.length));
    randomVocabulary = selectedVocabularyList[randomIndex];
    const definition = randomVocabulary.definitions && randomVocabulary.definitions['english'];
    isProperToShow = definition && randomVocabulary.definitions['english'].trim().length > 0 && excludedList.indexOf(JSON.hashCode(randomVocabulary)) === -1;
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
    let examplesContent = "";
    const examplesTemplate =
        '<p class="title">Example usages:</p>' +
        '<ul class="example-usages">' +
        '   {{examples}}' +
        '</ul>';
    for (let i = 0; i < randomVocabulary.examples.length; i++) {
        const example = randomVocabulary.examples[i].trim();
        if (example.length > 0) {
            examplesContent += '<li>' + example + '</li>';
        }
    }
    if (examplesContent && examplesContent !== "") {
        examplesContent = examplesTemplate.replace("{{examples}}", examplesContent);
    }

    // Render translation part
    let translationContent = "";

    const translation = randomVocabulary.definitions['turkish'];
    if (translation && translation.length > 0) {
        translationContent =
            '<p class="title">Click for meaning in Turkish:</p>' +
            '<p class="translation">' + translation + '</p>';
    }

    // Hide definition, translation and examples if option enabled
    const blurred = localStorage.getItem("hideMeaning") === 'true' ? 'blurry-text' : '';

    // Render the sticky
    const stickyTemplate =
        '<p class="word">{{word}}</p>' +
        '<div class="wrap {{blurred}}">' +
        '<p class="definition">{{definition}}</p>' +
        '{{translation}}' +
        '{{examples}}' +
        '</div>';

    const renderingResult = stickyTemplate
        .replace('{{word}}', randomVocabulary.word)
        .replace('{{definition}}', randomVocabulary.definitions['english'])
        .replace('{{translation}}', translationContent)
        .replace('{{blurred}}', blurred)
        .replace('{{examples}}', examplesContent);

    $('div.container').append($(renderingResult));

    $('.quote-container').show();
}

function goToInterceptedUrl() {
    let interceptedUrl = window.location.search.replace('?url=', '').trim();
    if (interceptedUrl.length === 0) {
        interceptedUrl = 'http://google.com';
    }
    window.location.href = interceptedUrl;
}
