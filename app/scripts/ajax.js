/* @flow */
// super lightweight utlities for ajax calls
function params(object /*: any */ ) /*: string */ {
    return Object.keys(object)
        .map(key => key.toString() + '=' + encodeURIComponent(object[key]))
        .join('&');
}

function promise(request /*: XMLHttpRequest */ ) /*: Promise */ {
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
