import {
    compose, mergeAll, zip, map, filter,
    fromPairs, all, allPass, reverse, equals, length,
} from 'ramda';
import querystring from 'querystring';

function router(patterns, options) {
    function fragments(pattern) {
        return pattern.split(/[#/]/).filter(s => s);
    }

    const rules = patterns.map(
        p => [
            fragments(
                options && options.shortcut && options.shortcut[p] || p
            ),
            fragments(p),
        ]
    );

    /**
     * parse
     *
     * @param {String} url
     * @return {Object}
     */
    function parse(url) {
        const [trunk, query] = url.split('?');
        const urlFragments = trunk.split(/[#/]/).filter(s => s);

        const test = allPass([
            compose(
                all(
                    ([value, key]) => key.startsWith(':') || value === key
                ),
                zip(urlFragments)
            ),
            compose(
                equals(urlFragments.length), length
            ),
        ]);

        const createPatch = compose(
            fromPairs, filter(([key]) => key.startsWith(':')), map(reverse), zip(urlFragments)
        );

        function build([target, patch]) {
            const res = {};
            let current = res;
            target.forEach(fragment => {
                if (patch[fragment]) {
                    current[fragment.replace(/^:/, '')] = patch[fragment];
                } else {
                    current = current[fragment] = {};
                }
            });
            if (query) {
                Object.assign(current, querystring.parse(query));
            }
            return res;
        }

        const createState = compose(
            mergeAll, map(build),
            map(([a, b]) => [a, createPatch(b)]), filter(([, a]) => test(a))
        );

        return createState(rules);
    }

    return { parse };
}

export default router;
