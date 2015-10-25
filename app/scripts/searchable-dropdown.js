const h = require('snabbdom/h');
const patch = require('snabbdom').init([
    require('snabbdom/modules/class'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/props'),
    require('snabbdom/modules/eventlisteners'),
    require('snabbdom/modules/style'),
]);
const c = require('ramda').compose;
const { curry, merge, map, filter } = require('ramda');

const flyd = require('./flyd.js');


const ActionType = {
    ChangeInput: 'ChangeInput',
    StartSearch: 'StartSearch',
    StopSearch: 'StopSearch',
    Select: 'Select',
    Init: 'Init',
    Update: 'Update',
};
Object.freeze(ActionType);

const listItem = curry((events, item) => (
    h('li', {
        on: {
            click: e => events([ ActionType.Select, e.target.textContent ]),
        },
        attrs: { 'data-value': item.value },
    }, item.name)
));

const view = curry((events, { all, keyword, showList }) => (
    h('div.searchable-dropdown', [
        h('input', {
            props: {
                value: keyword,
            },
            on: {
                input: e => events([ ActionType.ChangeInput, e.target.value ]),
                focus: [ events, [ ActionType.StartSearch ]],
            },
        }),
        h('ul', {
            style: { display: showList ? '' : 'none' },
        }, c(
            map(listItem(events)), filter(item => item.name.startsWith(keyword))
        )(all)),
    ])
));

const diff = ({ all, keyword, showList }, [ actionType, data ]) => {
    switch (actionType) {
        case ActionType.ChangeInput:
            return { keyword: data };
        case ActionType.StartSearch:
            return { showList: true };
        case ActionType.StopSearch:
            return { showList: false };
        case ActionType.Update:
            return { all: data };
        case ActionType.Select:
            return { keyword: data, showList: false };
        default:
            return {};
    }
};

const update = (state, action) => merge(state, diff(state, action));

const SearchableDropdown = (root, list) => {
    const actions$ = flyd.stream([ ActionType.Init ]);

    flyd.scan(
        patch, root,
        c(
            flyd.map(view(actions$)),
            flyd.scan(update, { all: (list || []), keyword: '', showList: false })
        )(actions$)
    );

    return {
        update: newList => actions$([ ActionType.Update, newList || [] ]),
    };
};

module.exports = SearchableDropdown;
