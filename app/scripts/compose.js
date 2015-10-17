import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import flyd from 'flyd';
import flatMap from 'flyd/module/flatmap';
import filter from 'flyd/module/filter';
import {compose as c, head, curry, merge, identity} from 'ramda';

/**
 * controller for the compose page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @return {undefined}
 */
function compose(root, postcards, toggle) {
    const patch = snabbdom.init([
        require('snabbdom/modules/props'),
        require('snabbdom/modules/class'),
        require('snabbdom/modules/attributes'),
        require('snabbdom/modules/eventlisteners'),
    ]);

    const actions$ = flyd.stream();

    const processImage = (file) => {
        const reader = new FileReader();
        reader.onload = progress => {
            actions$( { type: 'changeCover', data: progress.target.result } );
        };
        reader.readAsDataURL(file);
    };

    function sendPostcard(message, cover) {
        console.log(cover);
        postcards.post({
            receiver: 2,
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
            case 'changeFile':
                processImage(action.data);
                return merge(state, { cover: action.data });
            case 'submit':
                sendPostcard(state.message, state.cover);
                return state;
            default:
                return state;
        }
    }

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
            msgPanel(action, state),
            h('div', { attrs: { 'data-tag': 'compose-tools' } }, [
                imageBtn(action), previewBtn(action, state.previewing), sendBtn(action),
            ]),
            h('div', { attrs: { 'data-tag': 'cover' } }, [
                h('img', { attrs: { src: state.src } }),
            ]),
        ])
    ));

    const initialState = {
        writing: false,
        previewing: false,
        message: '',
        cover: '',
        src: '//:0',
    };

    const process = c(
            flyd.scan(patch, root),
            flyd.map(view(actions$)),
            flyd.scan(update, initialState)
            );

    return flatMap(() => process(actions$), filter(identity, toggle));
}

export default compose;
