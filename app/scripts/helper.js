/* @flow */
// TODO recheck tern lint, flow is too aggresive to always cause false positive
// since flow doesn't recognize filter, we use this style
function removeNulls /*:: <T> */ (
    nullableList /*: [?T] */
) /*: [T] */ {
    const res = [];
    nullableList.forEach(e => {
        if (e) {
            res.push(e);
        }
    });
    return res;
}

export { removeNulls };
