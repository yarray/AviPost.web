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

// convert array-like things (NodeList for example) to array
var array = function(
    list /*: any */) /*: [any] */ {
    return Array.prototype.slice.call(list);
};

// since flow doesn't recognize filter, we use this style
var removeNulls = function /*:: <T> */ (
    nullableList /*: [?T] */
) /*: [T] */ {
    var res = [];
    nullableList.forEach(function(e) {
        if (e) {
            res.push(e);
        }
    });
    return res;
};

module.exports = {
    loadImage: loadImage,
    array: array,
    removeNulls: removeNulls
};
