/* @flow */
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
    removeNulls: removeNulls
};
