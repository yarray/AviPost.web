/* @flow */
var nav = function(element /*: Element */, path /*: string */) {
    var links = Array.from(element.getElementsByTagName('a'));
    links.forEach(function(a) {
        if (a.getAttribute('href') === path) {
            a.classList.add('activated');
        } else {
            a.classList.remove('activated');
        }
    });
};

module.exports = nav;
