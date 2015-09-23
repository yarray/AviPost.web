/**
 * controller for the compose page
 *
 * @param {HTMLElement} root
 * @param {Resource} postcards
 * @return {undefined}
 */
function compose(root, postcards) {
    const status = {};

    const msgPanel = root.querySelector('textarea');
    const placeholder = msgPanel.getAttribute('placeholder');

    const coverInput = root.querySelector('input[type=file]');
    const bg = root.querySelector('[data-tag=cover]');

    const previewBtn = root.querySelector('[data-tag=preview]');
    const sendBtn = root.querySelector('[data-tag=send]');

    msgPanel.removeAttribute('disabled'); // don't know why firefox "remember" disabled state even after refreshing
    msgPanel.addEventListener('focus', e => {
        root.classList.add('writing');
        e.target.removeAttribute('placeholder');
    });

    msgPanel.addEventListener('blur', e => {
        root.classList.remove('writing');
        e.target.setAttribute('placeholder', placeholder);
    });

    coverInput.addEventListener('change', e => {
        const files = e.target.files;
        if (files && files[0]) {
            const reader = new FileReader();

            reader.onload = progress => {
                bg.getElementsByTagName('img')[0]
                    .setAttribute('src', progress.target.result);
            };

            reader.readAsDataURL(files[0]);
            status.cover = files[0];
        }
    });

    previewBtn.addEventListener('click', e => {
        root.classList.toggle('preview');
        e.target.classList.toggle('fa-eye-slash');
        if (!msgPanel.hasAttribute('disabled')) {
            msgPanel.setAttribute('disabled', '');
        } else {
            msgPanel.removeAttribute('disabled');
        }
        e.preventDefault();
    });

    sendBtn.addEventListener('click', e => {
        postcards.post({
            receiver: 2,
            message: msgPanel.textContent,
            cover: status.cover,
        });
        // otherwise the event will be triggered twice: is there better solution?
        e.preventDefault();
    });
}

export default compose;
