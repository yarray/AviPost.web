const snabbdom = require('snabbdom');
const { prepend, head, last, equals, merge, identity, pick } = require('ramda');
const c = require('ramda').compose;
const list = require('ramda').of;

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
        LoadUsers: 'LoadUsers',
        ReadCover: 'ReadCover',
    },
    EventType
);
Object.freeze(ActionType);

/**
 * controller for the compose page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @return {undefined}
 */
function compose(root, postcards, users, toggle) {
    const init$ = flyd.filter(identity, toggle);
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

    function update(state, [ action, data ]) {
        switch (action) {
            case ActionType.StartWriting:
                return merge(state, { writing: true });
            case ActionType.StopWriting:
                return merge(state, { writing: false });
            case ActionType.TogglePreview:
                return merge(state, { previewing: !state.previewing });
            case ActionType.ChangeMessage:
                return merge(state, { message: data });
            case ActionType.ChangeReceiver:
                const receiver = state.users.find(
                    u => u.username === data).id;
                return merge(state, { receiver });
            case ActionType.LoadUsers:
                return merge(state, { users: data });
            case ActionType.ChangeCover:
                return merge(state, { cover: data });
            case ActionType.ReadCover:
                return merge(state, { background: data });
            default:
                return state;
        }
    }

    // create/redirect actions
    const pushAction = type => c(action$, prepend(type), list);
    // read cover after selecting file
    c(
        flyd.on(pushAction(ActionType.ReadCover)),
        flyd.map(c(loadFile, last)),
        flyd.filter(c(equals(ActionType.ChangeCover), head))
    )(action$);

    // load available receivers at the beginning
    c(
        flyd.on(pushAction(ActionType.LoadUsers)),
        flyd.map(users.get)
    )(init$);

    const state$ = flyd.scan(update, initialState, action$);

    // send postcard
    const sendPostcard = c(
        postcards.post, pick(['receiver', 'message', 'cover']));
    const submit$ = flyd.filter(([action]) => action === ActionType.Submit, action$);
    flyd.on(sendPostcard, flyd.sampleOn(submit$, state$));

    // view loop
    const render$ = c(
        flyd.scan(patch, root),
        flyd.map(view(action$))
    )(state$);

    return flyd.switchLatest(flyd.map(() => render$, init$));
}

module.exports = compose;
