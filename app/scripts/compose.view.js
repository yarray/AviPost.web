const h = require('snabbdom/h');
const { head, curry, map } = require('ramda');


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

const imageBtn = events => (
    h('label.upload-cover.fa.fa-image', [
        h('input', { attrs: { type: 'file' },
            on: {
                change: e => events([ EventType.ChangeCover, head(e.target.files) ]),
            },
        }),
    ])
);

const previewBtn = (events, previewing) => (
    h('label.preview.fa', {
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
    h('label.send.fa.fa-send', [
        h('input', { attrs: { type: 'button' },
            on: {
                click: [ events, [ EventType.Submit ]],
            },
        }),
    ])
);

const searchableDropdown = state => (
    h('div', { searchableDropdown: {
        params: map(
            ({ username, id }) => ({ name: username, value: id }), state.users
        ),
    }})
);

const view = curry((events, state) => (
    h('div', {
        class: {
            preview: state.previewing,
            writing: state.writing,
        },
    }, [
        h('div.compose-tools', [
            imageBtn(events), previewBtn(events, state.previewing), sendBtn(events),
        ]),
        msgPanel(events, state),
        h('div.misc', [
            searchableDropdown(state),
        ]),
        h('div.cover', [
            h('img', { attrs: { src: state.background } }),
        ]),
    ])
));


module.exports = { EventType, view };
