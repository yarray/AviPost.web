/* @flow */
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
    array: array,
    removeNulls: removeNulls
};
