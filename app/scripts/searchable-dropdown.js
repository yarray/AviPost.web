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
        attrs: { 'data-value': item },
    }, item)
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
            map(listItem(events)), filter(item => item.startsWith(keyword))
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

const SearchableDropdown = (root, { list, on }) => {
    const actions$ = flyd.stream([ ActionType.Init ]);
    const state$ = flyd.scan(update, { all: (list || []), keyword: '', showList: false, on }, actions$);

    const handlers = merge({
        selected: () => {},
    })(on);

    flyd.do(
        ([, keyword]) => handlers.selected(keyword),
        flyd.filter(([type]) => type === ActionType.Select, actions$)
    );

    flyd.scan(
        patch, root,
        flyd.map(view(actions$), state$)
    );

    return {
        update: ({ list: newList }) => actions$([ ActionType.Update, newList || [] ]),
    };
};

module.exports = SearchableDropdown;
