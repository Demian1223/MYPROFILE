const fs = require('fs');
const cheerio = require('cheerio');

let html = fs.readFileSync('kapruka.html', 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

let hasImageSectionIndex = 0;

$('.cs-section > .reveal').each((i, el) => {
    const $reveal = $(el);
    const $imgWrap = $reveal.children('div').has('img');
    const $img = $imgWrap.find('img').first();

    // Check if this section has an image
    if ($img.length > 0) {
        $reveal.removeClass('reveal').addClass('phase-entry reveal');

        // Alternating reverse class
        if (hasImageSectionIndex % 2 === 1) {
            $reveal.addClass('reverse');
        }
        hasImageSectionIndex++;

        // Extract all elements except the image wrapper
        const $textElements = $reveal.children().not($imgWrap);

        // Create wrappers
        const $phaseText = $('<div class="phase-text"></div>');
        const $phaseImg = $('<div class="phase-img"></div>');

        // Process text elements to match buslink style
        $textElements.each((idx, txtEl) => {
            const $t = $(txtEl);
            if ($t.hasClass('cs-section-num')) {
                $t.removeClass('cs-section-num').addClass('phase-num');
                $phaseText.append($t);
            } else if ($t.hasClass('cs-section-label')) {
                $t.removeClass('cs-section-label kap').addClass('phase-tag');
                $phaseText.append($t);
            } else if ($t.hasClass('cs-section-title')) {
                const $h3 = $('<h3 class="phase-title"></h3>').html($t.html());
                $phaseText.append($h3);
            } else {
                $phaseText.append($t);
            }
        });

        // Strip out the inline style of the img wrapper, or just grab the img
        $img.removeAttr('style'); // buslink phase-img img has CSS styling in stylesheet
        $phaseImg.append($img);

        $imgWrap.remove(); // remove old wrapper

        $reveal.empty().append($phaseText).append($phaseImg);
    }
});

fs.writeFileSync('kapruka.html', $.html());
console.log("Done");
