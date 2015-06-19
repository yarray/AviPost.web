/* @flow */

var compose = function(root /* : Element */) {
    var msgPanel = root.querySelector('textarea');
    var placeholder = msgPanel.getAttribute('placeholder');

    var coverInput = root.querySelector('input[type=file]');
    var bg = root.querySelector("[data-tag=cover]");

    var preview = root.querySelector('[data-tag=preview]');

    msgPanel.removeAttribute('disabled'); // don't know why firefox "remember" disabled state even after refreshing
    msgPanel.addEventListener('focus', function(e) {
        root.classList.add('foremost');
        e.target.removeAttribute('placeholder');
    });

    msgPanel.addEventListener('blur', function(e) {
        root.classList.remove('foremost');
        e.target.setAttribute('placeholder', placeholder);
    });

    coverInput.addEventListener('change', function(e) {
        var files = e.target.files;
        if (files && files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                bg.getElementsByTagName('img')[0]
                    .setAttribute('src', e.target.result);
            };

            reader.readAsDataURL(files[0]);
        }
    });

    preview.addEventListener('click', function(e) {
        bg.classList.toggle('white-trans');
        root.classList.toggle('foremost');
        e.target.classList.toggle('fa-eye-slash');
        if (!msgPanel.hasAttribute('disabled')) {
            msgPanel.setAttribute('disabled', '');
        } else {
            msgPanel.removeAttribute('disabled');
        }
        e.preventDefault();
    });
};

module.exports = compose;
