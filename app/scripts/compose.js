/**
 * controller for the compose page
 *
 * @param {HTMLElement} root
 * @return {undefined}
 */
function compose(root) {
    const msgPanel = root.querySelector('textarea');
    const placeholder = msgPanel.getAttribute('placeholder');

    const coverInput = root.querySelector('input[type=file]');
    const bg = root.querySelector('[data-tag=cover]');

    const preview = root.querySelector('[data-tag=preview]');

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
        }
    });

    preview.addEventListener('click', e => {
        root.classList.toggle('preview');
        e.target.classList.toggle('fa-eye-slash');
        if (!msgPanel.hasAttribute('disabled')) {
            msgPanel.setAttribute('disabled', '');
        } else {
            msgPanel.removeAttribute('disabled');
        }
        e.preventDefault();
    });
}

export default compose;
