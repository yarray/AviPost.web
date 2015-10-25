const h = require('snabbdom/h');
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/style'),
]);
const c = require('ramda').compose;

const flyd = require('./flyd.js');


const ActionType = {
    ChangeInput: 'ChangeInput',
    StartSearch: 'StartSearch',
    StopSearch: 'StopSearch',
    Init: 'Init',
};
Object.freeze(ActionType);

const listItem = item => (
    h('li', { attrs: { 'data-value': item.value } }, item.name)
);

const view = flyd.curryN(2, (events, { matched, active } ) => (
    h('div', [
        h('input', {
            on: {
                change: e => events([ ActionType.ChangeInput, e.target.value ]),
                focus: [ events, [ ActionType.StartSearch ]],
                blur: [ events, [ ActionType.StopSearch ]],
            },
        }),
        h('ul', {
            style: { display: active ? '' : 'none' },
        }, matched.map(listItem)),
    ])
));

const update = ({ all, matched, active }, [ action, data ]) => {
    switch (action) {
        case ActionType.ChangeInput:
            return {
                all, active,
                matched: all.filter(
                    item => item.name.startsWith(data)),
            };
        case ActionType.StartSearch:
            return { all, matched, active: true };
        case ActionType.StopSearch:
            return { all, matched, active: false };
        default:
            return { all, matched, active };
    }
};

const SearchableDropdown = (root, list) => {
    const actions$ = flyd.stream([ ActionType.Init ]);

    flyd.scan(
        patch, root,
        c(
            flyd.map(view(actions$)),
            flyd.scan(update, { all: list, matched: list, active: false })
        )(actions$)
    );

    return {};
};

module.exports = SearchableDropdown;
