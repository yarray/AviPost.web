// ajax.js
// super lightweight utlities for ajax calls

var params = function(object) {
    var res = Object.keys(object)
        .map(function(key) {
            return key.toString() + '=' + encodeURIComponent(object[key]);
        })
        .join(seperator = '&');
    return res;
};

module.exports = {
    params: params
};
