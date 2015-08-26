/**
 * render data with a template, return a html string
 * @param {object} data
 * @param {string} template
 * @return {string}
 */
function render2html(data, template) {
    return Object.keys(data).reduce(
        (res, key) => res.replace(RegExp('{{' + key + '}}', 'g'), data[key]),
        template
    );
}


/**
 * render data with a template, return html element
 * @param {object} data
 * @param {string} template
 * @return {?HTMLElement}
 */
function render(data, template) {
    const buffer = document.createElement('div');
    buffer.innerHTML = render2html(data, template.outerHTML);

    const result = buffer.firstElementChild;
    if (!result) {
        return null;
    }

    Array.from(result.querySelectorAll('img')).forEach(img => {
        img.src = img.getAttribute('data-src') || img.src;
        img.removeAttribute('data-src');
    });
    result.removeAttribute('data-template');
    result.removeAttribute('id'); // id should be unique to template

    return result;
}


/**
 * render a list of data with a template, return a list of html elements
 *
 * @param {object[]} data
 * @param {string} template
 * @return {Array.<?HTMLElement>}
 */
function renderArray(data, template) {
    return data.map(d => render(d, template));
}


export default { renderArray, render, render2html };
