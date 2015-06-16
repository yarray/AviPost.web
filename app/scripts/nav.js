/* @flow */
var nav = function(element /*: Element */, path /*: string */) {
    var links = Array.from(element.getElementsByTagName('a'));
    links.forEach(function(a) {
        a.classList.add('inactive');
        if (a.getAttribute('href') === path) {
            a.classList.remove('inactive');
        }
    });
};

module.exports = nav;
