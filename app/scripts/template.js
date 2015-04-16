// A deadly simple one-way binding module, using observe() is es7
var array = require('./utils').array;


var render2html = function(data, template) {
    var res = template;
    Object.keys(data).forEach(function(key) {
        res = res.replace(RegExp('{{' + key + '}}', 'g'), data[key]);
    });
    return res;
};

var render = function(data, template) {
    var buffer = document.createElement('div');
    buffer.innerHTML = render2html(data, template.outerHTML);
    array(buffer.querySelectorAll('img')).forEach(function(img) {
        img.src = img.getAttribute('data-src') || img.src;
    });
    buffer.firstChild.removeAttribute('data-template');

    return buffer.firstChild;
};

var renderArray = function(data, template) {
    return data.map(function(d) {
        return render(d, template);
    });
};

module.exports = {
    renderArray: renderArray,
    render: render
};
