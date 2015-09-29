/**
 * nav
 *
 * @param {HTMLElement} element
 * @param {string} page
 */
function nav(element, page) {
    const links = Array.from(element.getElementsByTagName('a'));
    links.forEach(a => {
        a.classList.add('inactive');
        if (a.getAttribute('data-page') === page) {
            a.classList.remove('inactive');
        }
    });
}

export default nav;
