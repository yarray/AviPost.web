/**
 * nav
 *
 * @param {HTMLElement} element
 * @param {string} path
 * @return {undefined}
 */
function nav(element, path) {
    const links = Array.from(element.getElementsByTagName('a'));
    links.forEach(a => {
        a.classList.add('inactive');
        if (a.getAttribute('href') === path) {
            a.classList.remove('inactive');
        }
    });
}

export default nav;
