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
        window.location.href = interceptedUrl;
    });

    $('.do-not-show-again').click(function () {
        window.location.href = interceptedUrl;
    });
}

function render() {
    var template =
        '<p class="word">{{word}}</p>' +
        '<p class="type">{{type}}</p>' +
        '<p class="definition">{{definition}}</p>' +
        '{{translation}}' +
        '<p class="title">Example usages:</p>' +
        '<ul class="example-usages">' +
        '   {{examples}}' +
        '</ul>';

    var randomIndex = Math.floor((Math.random() * vocabulary.globish.length));
    var randomVocabulary = vocabulary.globish[randomIndex];

    var examplesContent = "";
    for (var i = 0; i < randomVocabulary.examples.length; i++) {
        examplesContent += '<li>' + randomVocabulary.examples[i] + '</li>';
    }

    var translationContent = "";
    if (randomVocabulary.definitions['turkish']) {
        translationContent =
            '<p class="title">Click for meaning in Turkish:</p>' +
            '<p class="translation blurry-text">' + randomVocabulary.definitions['turkish'] + '</p>';
    }

    var renderResult = template
        .replace('{{word}}', randomVocabulary.word)
        .replace('{{type}}', randomVocabulary.type)
        .replace('{{definition}}', randomVocabulary.definitions['english'])
        .replace('{{translation}}', translationContent)
        .replace('{{examples}}', examplesContent);

    $('div.container').append($(renderResult));
}
