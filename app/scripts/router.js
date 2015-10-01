import { zipWith, map, mergeAll } from 'ramda';
import querystring from 'querystring';


function patchesSingle(patternDef, urlDef) {
    return mergeAll(zipWith((ptoken, utoken) => {
        if (ptoken.startsWith(':')) {
            const res = {};
            res[ptoken] = utoken;
            return res;
        }
    }, patternDef, urlDef));
}

function matchSingle(patternDef, urlDef) {
    return (zipWith((ptoken, utoken) => {
        return utoken === ptoken || ptoken.startsWith(':');
    }, patternDef, urlDef).every(s => s));
}

function parseSingle(patternDef, patches, query) {
    const res = {};
    let current = res;
    patternDef.forEach(p => {
        if (patches[p]) {
            current[p.replace(/^:/, '')] = patches[p];
        } else {
            current = current[p] = {};
        }
    });
    if (query) {
        Object.assign(current, querystring.parse(query));
    }
    return res;
}


function router(patterns) {
    const patternDefs = patterns.map(p => p.split(/[#/]/).filter(s => s));

    /**
     * parse
     *
     * @param {String} url
     * @return {Object}
     */
    function parse(url) {
        const [trunk, query] = url.split('?');
        const urlDef = trunk.split(/[#/]/).filter(s => s);
        return mergeAll(map(patternDef => {
            return !matchSingle(patternDef, urlDef) ? {} :
                parseSingle(patternDef, patchesSingle(patternDef, urlDef), query);
        }, patternDefs));
    }

    function depth(i) {
        // TODO
    }
    return {
        parse,
        depth,
    };
}

export default router;
