// super lightweight utlities for ajax calls
/**
 * build html query string from params
 *
 * @param {object} object
 * @return {String}
 */
function querystr(object) {
    return Object.keys(object)
        .map(key => key.toString() + '=' + encodeURIComponent(object[key]))
        .join('&');
}

/**
 * create a Promise from XMLHttpRequest
 *
 * @param {String} url
 * @param {String} verb
 * @param {?Object} headers
 * @param {?Object} params
 * @param {?Object} data
 *
 * @return {Promise}
 */
function ajax(url, verb, { params = {}, headers = {}, data = {} }) {
    const request = new XMLHttpRequest();

    request.open(verb, `${url}?${querystr(params)}`);
    Object.keys(headers).forEach(key => {
        request.setRequestHeader(key, headers[key]);
    });

    return new Promise((resolve, reject) => {
        request.onload = () => {
            if (request.status < 400) {
                resolve(JSON.parse(request.responseText), request);
            } else {
                reject(new Error(request.statusText));
            }
        };

        const formdata = new FormData();
        Object.keys(data).forEach(key => {
            formdata.append(key, data[key]);
        });

        request.send(formdata);
    });
}


module.exports = ajax;
