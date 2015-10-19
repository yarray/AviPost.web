const snabbdom = require('snabbdom');
const h = require('snabbdom/h');
const flyd = require('flyd');
const flatMap = require('flyd/module/flatmap');
const filter = require('flyd/module/filter');
const { head, curry, merge, identity } = require('ramda');
const c = require('ramda').compose;


const patch = snabbdom.init([
    require('snabbdom/modules/props'),
    require('snabbdom/modules/class'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/eventlisteners'),
]);

const msgPanel = (action, state) => (
    h('textarea', { attrs: { rows: 4, cols: 40, maxlength: 140,
            placeholder: state.writing ? '' : 'say something',
            disabled: state.previewing,
        },
        on: {
            focus: [ action, { type: 'focus'} ],
            blur: [ action, { type: 'blur'} ],
            input: e => action( { type: 'changeMessage', data: e.target.value } ),
        },
    })
);

const rcvrPanel = (id, receivers) => (
    h(`datalist#${id}`, receivers.map(receiver => (
        h('option', {
            attrs: { value: receiver.username },
        })
    )))
);

const imageBtn = actions => (
    h('label.fa.fa-image', { attrs: { 'data-tag': 'upload-cover' },
    }, [
        h('input', { attrs: { type: 'file' },
            on: { change: e => actions({ type: 'changeFile', data: head(e.target.files) } ) } }
         ),
    ])
);

const previewBtn = (action, previewing) => (
    h('label.fa', { attrs: { 'data-tag': 'preview' },
        class: {
            'fa-eye': !previewing,
            'fa-eye-slash': previewing,
        },
    }, [
        h('input', { attrs: { type: 'button' },
            on: { click: [ action, { type: 'preview' } ] } }
         ),
    ])
);

const sendBtn = action => (
    h('label.fa.fa-send', { attrs: { 'data-tag': 'send' },
    }, [
        h('input', { attrs: { type: 'button' },
            on: { click: [ action, { type: 'submit'} ] },
        }),
    ])
);

const view = curry((action, state) => (
    h('div', {
        class: {
            preview: state.previewing,
            writing: state.writing,
        },
    }, [
        h('input.receiver', { attrs: { list: 'receivers' },
            on: {
                input: e => action( { type: 'changeReceiver', data: e.target.value } ),
            },
        }),
        rcvrPanel('receivers', state.users),
        msgPanel(action, state),
        h('div', { attrs: { 'data-tag': 'compose-tools' } }, [
            imageBtn(action), previewBtn(action, state.previewing), sendBtn(action),
        ]),
        h('div', { attrs: { 'data-tag': 'cover' } }, [
            h('img', { attrs: { src: state.src } }),
        ]),
    ])
));

/**
 * controller for the compose page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @return {undefined}
 */
function compose(root, postcards, users, toggle) {
    const actions$ = flyd.stream();

    const processImage = (file) => {
        const reader = new FileReader();
        reader.onload = progress => {
            actions$( { type: 'changeCover', data: progress.target.result } );
        };
        reader.readAsDataURL(file);
    };

    function sendPostcard(message, cover, receiver) {
        console.log(cover);
        postcards.post({
            receiver: receiver,
            message: message,
            cover: cover,
        });
    }

    function update(state, action) {
        console.log(action);

        switch (action.type) {
            case 'changeCover':
                return merge(state, { src: action.data });
            case 'focus':
                return merge(state, { writing: true });
            case 'blur':
                return merge(state, { writing: false });
            case 'preview':
                return merge(state, { previewing: !state.previewing });
            case 'changeMessage':
                return merge(state, { message: action.data });
            case 'changeReceiver':
                return merge(state, { receiver: action.data });
            case 'changeFile':
                processImage(action.data);
                return merge(state, { cover: action.data });
            case 'submit':
                sendPostcard(state.message, state.cover,
                     state.users.find(u => u.username === state.receiver).id);
                return state;
            case 'loadUsers':
                return merge(state, { users: action.data });
            default:
                return state;
        }
    }

    const initialState = {
        writing: false,
        previewing: false,
        message: '',
        cover: '',
        src: '//:0',
        users: [],
        receiver: -1,
    };

    c(
        flyd.on(receivers => actions$({ type: 'loadUsers', data: receivers })),
        flyd.map(users.get)
    )(filter(identity, toggle));

    const process = c(
            flyd.scan(patch, root),
            flyd.map(view(actions$)),
            flyd.scan(update, initialState)
            );

    return flatMap(() => process(actions$), filter(identity, toggle));
}

module.exports = compose;
