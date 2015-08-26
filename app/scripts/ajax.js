// super lightweight utlities for ajax calls
/**
 * build html query string from params
 *
 * @param {object} object
 * @return {string}
 */
function params(object) {
    return Object.keys(object)
        .map(key => key.toString() + '=' + encodeURIComponent(object[key]))
        .join('&');
}

/**
 * create a Promise from XMLHttpRequest
 *
 * @param {XMLHttpRequest} request
 * @return {Promise}
 */
function promise(request ) {
    return new Promise((resolve, reject) => {
        request.onload = () => {
            if (request.status < 400) {
                resolve(request);
            } else {
                reject(request);
            }
        };
        request.send();
    });
}

export default { params, promise };
