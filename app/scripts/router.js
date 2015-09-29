import { mapObj, test } from 'ramda';

function router(rules) {
    return url => {
        return mapObj(pattern => test(new RegExp(pattern), url), rules);
    };
}

export default router;
