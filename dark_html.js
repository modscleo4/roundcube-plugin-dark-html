/**
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @return {{r: number, g: number, b: number, a: number}}
 */
function rgba(r, g, b, a) {
    return {r, g, b, a};
}

/**
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @return {{r: number, g: number, b: number, a: number}}
 */
function rgb(r, g, b) {
    return {r, g, b, a: 1};
}

/**
 *
 * @param {object} params
 * @param {number} params.r
 * @param {number} params.g
 * @param {number} params.b
 * @param {number} params.a
 * @return {{h: number, s: number, l: number, a: number}}
 */
function RGBToHSL({r, g, b, a}) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue
    if (delta == 0) { // No difference
        h = 0;
    } else if (cmax == r) { // Red is max
        h = ((g - b) / delta) % 6;
    } else if (cmax == g) { // Green is max
        h = (b - r) / delta + 2;
    } else { // Blue is max
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) {
        h += 360;
    }

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {h, s, l, a};
}

let inverted = false;

/**
 *
 * @param {HTMLElement} el
 * @return {void}
 */
function invert(el) {
    if (!(el instanceof HTMLElement)) {
        return;
    }

    console.log(el);

    const _rgba = eval(getComputedStyle(el).backgroundColor);
    const hsla = RGBToHSL(_rgba);

    if (hsla.s < 10 && hsla.l > 75) {
        console.log(el, 'white');
        const _textRGBA = eval(getComputedStyle(el).color);
        el.style.backgroundColor = 'rgba(' + (255 - _rgba.r) + ', ' + (255 - _rgba.g) + ', ' + (255 - _rgba.b) + ', ' + (_rgba.a) + ')';
        el.style.color = 'rgba(' + (255 - _textRGBA.r) + ', ' + (255 - _textRGBA.g) + ', ' + (255 - _textRGBA.b) + ', ' + (_textRGBA.a) + ')';
        el.setAttribute('data-bg-invert', true);
    } else if (_rgba.r === 0 && _rgba.g === 0 && _rgba.b === 0 && _rgba.a === 0) {
        // no bg color
        const _textRGBA = eval(getComputedStyle(el).color);
        const textHSLA = RGBToHSL(_textRGBA);

        if (textHSLA.s < 15 && textHSLA.l < 45) { // black
            el.style.color = 'rgba(' + (255 - _textRGBA.r) + ', ' + (255 - _textRGBA.g) + ', ' + (255 - _textRGBA.b) + ', ' + (_textRGBA.a) + ')';
            el.setAttribute('data-fg-invert', true);
        }
    }

    el.childNodes.forEach(e => {
        invert(e);
    });
}

/*rcmail.addEventListener('init', function (evt) {
    // create custom button
    var button = $('<A>').attr('id', 'rcmSampleButton').html(rcmail.gettext('buttontitle', 'sampleplugin'));
    button.bind('click', function (e) { return rcmail.command('plugin.samplecmd', this); });

    // add and register
    rcmail.add_element(button, 'toolbar');
    rcmail.register_button('plugin.samplecmd', 'rcmSampleButton', 'link');
    rcmail.register_command('plugin.samplecmd', (a) => console.log(a), true);
});*/

document.addEventListener('DOMContentLoaded', () => {
    invert(document.querySelector('#messagebody'));
    inverted = true;
});
