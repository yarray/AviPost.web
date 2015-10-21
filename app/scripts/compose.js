const snabbdom = require('snabbdom');
const h = require('snabbdom/h');
const { head, curry, merge, identity } = require('ramda');
const c = require('ramda').compose;

const flyd = require('./flyd.js');


const patch = snabbdom.init([
    require('snabbdom/modules/props'),
    require('snabbdom/modules/class'),
    require('snabbdom/modules/attributes'),
    require('snabbdom/modules/eventlisteners'),
]);

const msgPanel = (emit, state) => (
    h('textarea', { attrs: { rows: 4, cols: 40, maxlength: 140,
            placeholder: state.writing ? '' : 'say something',
            disabled: state.previewing,
        },
        on: {
            // TODO change event name
            focus: emit('focus'),
            blur: emit('blur'),
            input: emit('changeMessage'),
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

const imageBtn = emit => (
    h('label.fa.fa-image', { attrs: { 'data-tag': 'upload-cover' },
    }, [
        h('input', { attrs: { type: 'file' },
            on: {
                change: emit('changeFile'),
            },
        }),
    ])
);

const previewBtn = (emit, previewing) => (
    h('label.fa', { attrs: { 'data-tag': 'preview' },
        class: {
            'fa-eye': !previewing,
            'fa-eye-slash': previewing,
        },
    }, [
        h('input', { attrs: { type: 'button' },
            on: {
                click: emit('preview'),
            },
        }),
    ])
);

const sendBtn = emit => (
    h('label.fa.fa-send', { attrs: { 'data-tag': 'send' },
    }, [
        h('input', { attrs: { type: 'button' },
            on: {
                click: emit('submit'),
            },
        }),
    ])
);

const view = curry((emit, state) => (
    h('div', {
        class: {
            preview: state.previewing,
            writing: state.writing,
        },
    }, [
        h('input.receiver', { attrs: { list: 'receivers' },
            on: {
                input: emit('changeReceiver'),
            },
        }),
        rcvrPanel('receivers', state.users),
        msgPanel(emit, state),
        h('div', { attrs: { 'data-tag': 'compose-tools' } }, [
            imageBtn(emit), previewBtn(emit, state.previewing), sendBtn(emit),
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

    // TODO change to promise based frp
    const processImage = (file) => {
        const reader = new FileReader();
        reader.onload = progress => {
            actions$( { type: 'changeCover', data: progress.target.result } );
        };
        reader.readAsDataURL(file);
    };

    // TODO use ramda.project
    function sendPostcard(message, cover, receiver) {
        console.log(cover);
        postcards.post({
            receiver: receiver,
            message: message,
            cover: cover,
        });
    }

    function update(state, action) {
        switch (action.type) {
            case 'focus':
                return merge(state, { writing: true });
            case 'blur':
                return merge(state, { writing: false });
            case 'preview':
                return merge(state, { previewing: !state.previewing });
            case 'changeMessage':
                return merge(state, { message: action.e.target.value });
            case 'changeReceiver':
                return merge(state, { receiver: action.e.target.value });
            case 'changeFile':
                const file = head(action.e.target.files);
                processImage(file);
                return merge(state, { cover: file });
            case 'submit':
                sendPostcard(state.message, state.cover,
                     state.users.find(u => u.username === state.receiver).id);
                return state;
            // TODO extract, end of events
            case 'changeCover':
                return merge(state, { src: action.data });
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

    const init = flyd.filter(identity, toggle);

    c(
        flyd.on(receivers => actions$({ type: 'loadUsers', data: receivers })),
        flyd.map(users.get)
    )(init);

    const process = c(
            flyd.scan(patch, root),
            flyd.map(view(flyd.emit(actions$))),
            flyd.scan(update, initialState)
            );

    return flyd.flatMap(() => process(actions$), init);
}

module.exports = compose;
