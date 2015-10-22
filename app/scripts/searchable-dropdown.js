const h = require('snabbdom/h');
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/style'),
]);
const c = require('ramda').compose;

const flyd = require('./flyd.js');


const listItem = item => (
    h('li', { attrs: { 'data-value': item.value } }, item.name)
);

const view = flyd.curryN(2, (emit, list, active) => (
    h('div', [
        h('input', {
            on: {
                change: emit('inputChange'),
                focus: emit('inputFocus'),
                blur: emit('inputBlur'),
            },
        }),
        h('ul', list.map(listItem), {
            style: { display: active ? null : 'none' },
        }),
    ])
));

const update = flyd.curryN(2, ({ all, matched }, action) => {
    switch (action.type) {
        case 'inputChange':
            return {
                all,
                matched: all.filter(
                    item => item.name.startsWith(action.e.target.value)),
            };
        default:
            return { all, matched };
    }
});

const SearchableDropdown = (root, list) => {
    // init with an empty action to trigger first patch
    const actions$ = flyd.stream({});

    const vnodes$ = c(
        flyd.map(view(flyd.emit(actions$))),
        flyd.scan(update({ all: list, matched: list }))
    )(actions$);

    flyd.scan(patch, root, vnodes$);

    return {};
};

module.exports = SearchableDropdown;
