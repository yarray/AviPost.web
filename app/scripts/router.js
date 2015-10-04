import {
    compose as c, mergeAll, zip, map, filter, converge,
    fromPairs, all, head, test, equals, __, either, both,
    last, assoc, merge, split, apply, eqProps,
} from 'ramda';
import querystring from 'querystring';

/**
 * router
 *
 * @param {[String]} patterns
 * @param {?Object} options
 * @return {Function}
 */
function router(patterns, options) {
    // pattern: String -> pattern fragments: [String]
    const fragments = c(filter(s => s), split(/[#/]/));

    /**
     * parse
     *
     * @param {String} url
     * @return {Object}
     */
    function parse(url) {
        const [trunk, query] = url.split('?');
        const urlFragments = trunk.split(/[#/]/).filter(s => s);

        // pattern: [String] -> is matched: Boolean
        const isMatched = both(
            c(
                all(either(c(test(/^:/), last), apply(equals))),
                zip(urlFragments)
            ),
            eqProps('length', urlFragments)
        );

        // pattern: [String] -> patch: { k: v }
        const createPatch = c(
            fromPairs,
            filter(c(test('/^:'), head)),
            zip(__, urlFragments)
        );

        // patch: { k: v } -> pattern: [String] -> state: Object
        function applyPatch(patch, pattern) {
            if (pattern.length === 0) {
                return querystring.parse(query);
            }

            const [cur, ...residue] = pattern;
            if (cur.startsWith(':')) {
                return merge(
                    assoc(cur.replace(/^:/, ''), patch[cur], {}),
                    applyPatch(patch, residue)
                );
            }
            return assoc(cur, applyPatch(patch, residue), {});
        }

        // pattern: String -> expanded pattern following shortcut: String
        const expand =
            p => options && options.shortcut && options.shortcut[p] || p;

        // pattern: String -> state: Object
        const createState = converge(
            applyPatch,
            c(createPatch, fragments), c(fragments, expand)
        );

        // patterns: [String] -> states for all routes: Object
        const createStates = c(mergeAll, map(createState), filter(c(isMatched, fragments)));

        return createStates(patterns);
    }

    return parse;
}

export default router;
