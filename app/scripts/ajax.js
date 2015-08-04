/* @flow */
// super lightweight utlities for ajax calls
var params = function(object /*: any */ ) /*: string */ {
    var res = Object.keys(object)
        .map(function(key) {
            return key.toString() + '=' + encodeURIComponent(object[key]);
        })
        .join('&');
    return res;
};

var promise = function(request /*: XMLHttpRequest */ ) /*: Promise */ {
    return new Promise(function(resolve, reject) {
        request.onload = function() {
            if (request.status < 400) {
                resolve(request);
            } else {
                reject(request);
            }
        };
        request.send();
    });
};

export { params, promise };
