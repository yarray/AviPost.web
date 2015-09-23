import ajax from './ajax.js';


/**
 * @typedef {Object} Resource
 * @property {Function} get
 * @property {Function} post
 */

/**
 * resource
 *
 * @param {String} baseUrl
 * @return {Resource}
 */
function resource(baseUrl, name) {
    const url = `${baseUrl}/${name}/`;

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}`} : {};

    const get = (params) => {
        return ajax(url, 'GET', { headers, params });
    };

    const post = (data) => {
        return ajax(url, 'POST', { headers, data });
    };

    return { get, post };
}

export default resource;
