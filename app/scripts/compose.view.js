const h = require('snabbdom/h');
const { head, curry } = require('ramda');


const EventType = {
    StartWriting: 'StartWriting',
    StopWriting: 'StopWriting',
    ChangeMessage: 'ChangeMessage',
    ChangeCover: 'ChangeCover',
    ChangeReceiver: 'ChangeReceiver',
    TogglePreview: 'TogglePreview',
    Submit: 'Submit',
};
Object.freeze(EventType);

const msgPanel = (events, state) => (
    h('textarea', { attrs: { rows: 4, cols: 40, maxlength: 140,
            placeholder: state.writing ? '' : 'say something',
            disabled: state.previewing,
        },
        on: {
            focus: [ events, [ EventType.StartWriting ]],
            blur: [ events, [ EventType.StopWriting ]],
            input: e => events([ EventType.ChangeMessage, e.target.value ]),
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

const imageBtn = events => (
    h('label.fa.fa-image', { attrs: { 'data-tag': 'upload-cover' },
    }, [
        h('input', { attrs: { type: 'file' },
            on: {
                change: e => events([ EventType.ChangeCover, head(e.target.files) ]),
            },
        }),
    ])
);

const previewBtn = (events, previewing) => (
    h('label.fa', { attrs: { 'data-tag': 'preview' },
        class: {
            'fa-eye': !previewing,
            'fa-eye-slash': previewing,
        },
    }, [
        h('input', { attrs: { type: 'button' },
            on: {
                click: [ events, [ EventType.TogglePreview ]],
            },
        }),
    ])
);

const sendBtn = events => (
    h('label.fa.fa-send', { attrs: { 'data-tag': 'send' },
    }, [
        h('input', { attrs: { type: 'button' },
            on: {
                click: [ events, [ EventType.Submit ]],
            },
        }),
    ])
);

const view = curry((events, state) => (
    h('div', {
        class: {
            preview: state.previewing,
            writing: state.writing,
        },
    }, [
        h('input.receiver', { attrs: { list: 'receivers' },
            on: {
                input: e => events([ EventType.ChangeReceiver, e.target.value ]),
            },
        }),
        rcvrPanel('receivers', state.users),
        msgPanel(events, state),
        h('div', { attrs: { 'data-tag': 'compose-tools' } }, [
            imageBtn(events), previewBtn(events, state.previewing), sendBtn(events),
        ]),
        h('div', { attrs: { 'data-tag': 'cover' } }, [
            h('img', { attrs: { src: state.background } }),
        ]),
    ])
));


module.exports = { EventType, view };
