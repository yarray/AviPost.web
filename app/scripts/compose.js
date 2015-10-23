const snabbdom = require('snabbdom');
const { last, merge, identity, pick } = require('ramda');
const c = require('ramda').compose;

const flyd = require('./flyd.js');
const { loadFile } = require('./async.js');
const { EventType, view } = require('./compose.view.js');


const patch = snabbdom.init([
    require('snabbdom/modules/props'),
    require('snabbdom/modules/class'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/eventlisteners'),
]);

const ActionType = Object.assign(
    {
        Init: 'Init',
        LoadUsers: 'LoadUsers',
        ReadCover: 'ReadCover',
    },
    EventType
);
Object.freeze(ActionType);

const diff = (state, [ actionType, data ]) => {
    switch (actionType) {
        case ActionType.StartWriting:
            return { writing: true };
        case ActionType.StopWriting:
            return { writing: false };
        case ActionType.TogglePreview:
            return { previewing: !state.previewing };
        case ActionType.ChangeMessage:
            return { message: data };
        case ActionType.ChangeReceiver:
            return { receiver: state.users.find(u => u.username === data).id };
        case ActionType.LoadUsers:
            return { users: data };
        case ActionType.ChangeCover:
            return { cover: data };
        case ActionType.ReadCover:
            return { background: data };
        default:
            return {};
    }
};

const update = (state, action) => merge(state, diff(state, action));


/**
 * controller for the compose page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @return {undefined}
 */
function compose(root, postcards, users, toggle) {
    const action$ = flyd.stream();

    const initialState = {
        writing: false,
        previewing: false,
        message: '',
        cover: {},
        background: '//:0',
        users: [],
        receiver: -1,
    };

    // create actions
    flyd.do(data => action$([ ActionType.Init, data ]))(
        flyd.first(flyd.filter(identity, toggle))
    );

    flyd.do(data => action$([ ActionType.ReadCover, data ]))(
        c(
            flyd.map(c(loadFile, last)),
            flyd.filter(([type]) => type === ActionType.ChangeCover)
        )(action$)
    );

    flyd.do(data => action$([ ActionType.LoadUsers, data ]))(
        c(
            flyd.map(users.get),
            flyd.filter(([type]) => type === ActionType.Init)
        )(action$)
    );

    // state and side effect
    const state$ = flyd.scan(update, initialState, action$);

    const sendPostcard = c(
        postcards.post, pick(['receiver', 'message', 'cover']));

    flyd.do(
        sendPostcard,
        flyd.sampleOn(
            flyd.filter(([type]) => type === ActionType.Submit, action$),
            state$
        )
    );

    flyd.scan(
        patch, root,
        flyd.map(view(action$), state$)
    );
}

module.exports = compose;
