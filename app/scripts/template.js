/* @flow */
// A deadly simple one-way binding module, using observe() is es7
function render2html (
    data /*: {} */ ,
    template /*: string */
) /* : string */ {
    return Object.keys(data).reduce(
        (res, key) => res.replace(RegExp('{{' + key + '}}', 'g'), data[key]),
        template
    );
}


function render(
    data /*: {} */ ,
    template /*: Element */
) /*: ?Element */ {
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


function renderArray(
    data /*: [{}] */ ,
    template /*: Element */
) /*: [?Element] */ {
    return data.map(d => render(d, template));
}


export default { renderArray, render, render2html };
