import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import most from 'most';
import flyd from 'flyd';
import filter from 'flyd/module/filter';
import {head, curry} from 'ramda';

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

    const init = () => {
        // var observer = new MutationObserver(function(mutations) {

        //     mutations.forEach(function(mutation) {
        //         console.log(mutation);
        //     });
        // });
        // var config = { attributes: true, childList: true, characterData: true, subtree: true };
        // observer.observe(document.getElementById('compose'), config);

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
        function update(model, action) {
            console.log(action);
            if (action.type === 'changeCover') {
                return { ...model, src: action.data };
            } else if (action.type === 'focus') {
                return { ...model, isWriting: true };
            } else if (action.type === 'blur') {
                return { ...model, isWriting: false };
            } else if (action.type === 'preview') {
                return { ...model, isPreview: !model.isPreview };
            } else if (action.type === 'changeMessage') {
                return { ...model, message: action.data };
            } else if (action.type === 'changeFile') {
                processImage(action.data);
                return { ...model, cover: action.data };
            } else if (action.type === 'submit') {
                sendPostcard(model.message, model.cover);
            }
            return model;
        }

        const textarea = (action, state) => {
            return h('textarea', {
                attrs: {
                    placeholder: state.isWriting ? '' : 'say something',
                    disabled: state.isPreview,
                    rows: '4',
                    cols: '40',
                    name: 'message',
                    maxlength: 140,
                },
                on: {
                    focus: [ action, { type: 'focus'} ],
                    blur: [ action, { type: 'blur'} ],
                    input: e => action( { type: 'changeMessage', data: e.target.value } ),
                },
            });
        };

        const cover = (action, state) => {
            return h('div',
                { attrs: { 'data-tag': 'cover'} },
                [ h('img', { attrs: { src: state.src } } ) ]
            );
        };

        const imageBtn = (action, state) => {
            return h('label.fa.fa-image',
                { attrs: { 'data-tag': 'upload-cover' } },
                [ h('input', {
                    attrs: { type: 'file' },
                    on: { change: e => action({ type: 'changeFile', data: head(e.target.files) } ) } }
                ) ]
            );
        };

        const previewBtn = (action, state) => {
            return h('label.fa',
                {
                    attrs: { 'data-tag': 'preview' },
                    class: {
                        'fa-eye': !state.isPreview,
                        'fa-eye-slash': state.isPreview,
                    },
                },
                [ h('input', {
                    attrs: { type: 'button' },
                    on: { click: [ action, { type: 'preview' } ] } }
                ) ]
            );
        };

        const sendBtn = (action, state) => {
            return h('label.fa.fa-send',
                { attrs: { 'data-tag': 'send' } },
                [ h('input', {
                    attrs: { type: 'button' },
                    on: { click: [ action, { type: 'submit'} ] },
                } ) ]
            );
        };

        const composeBtns = (action, state) => {
            return h('div',
                { attrs: { 'data-tag': 'compose-tools' } },
                [ imageBtn(action, state), previewBtn(action, state), sendBtn(action, state) ] );
        };

        const view = curry((action, state) => {
            return h('div', [
                textarea(action, state),
                composeBtns(action, state),
                cover(action, state),
            ]);
        });
        const initialState = {
            isWriting: false,
            isPreview: false,
            message: '',
            cover: '',
            src: '//:0',
        };
        const actions$ = flyd.stream();
        const model$ = flyd.scan(update, initialState, actions$);
        const vnode$ = flyd.map(view(actions$), model$);
        flyd.scan(patch, root, vnode$);
    };

    toggle.take(1).observe(init);
}

export default compose;
