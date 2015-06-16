/* @flow */
// dom wrappers
var imagesLoaded = require('imagesloaded');

// since loadImage is an event and will not resolve to value, we can give one
var loadImage = function /*:: <T> */ (
    container /*: Element */ ,
    value /*: T */
) /*: Promise<T> */ {
    return new Promise(function(resolve, reject) {
        imagesLoaded(container, function() {
            resolve(value);
        });
    });
};

module.exports = {
    loadImage
};
