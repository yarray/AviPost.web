/* @flow */

var compose = function(root /* : Element */) {
    var bg = root.querySelector(".background");
    var paper = root.querySelector('textarea');
    var placeholder = paper.getAttribute('placeholder');

    paper.addEventListener('focus', function() {
        bg.classList.add('light-overlay');
        paper.removeAttribute('placeholder');
    });

    paper.addEventListener('focusout', function() {
        bg.classList.remove('light-overlay');
        paper.setAttribute('placeholder', placeholder);
    });
};

module.exports = compose;
