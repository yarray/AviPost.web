/* @flow */
function nav(element /*: Element */, path /*: string */) {
    const links = Array.from(element.getElementsByTagName('a'));
    links.forEach(a => {
        a.classList.add('inactive');
        if (a.getAttribute('href') === path) {
            a.classList.remove('inactive');
        }
    });
}

export default nav;
