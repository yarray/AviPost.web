import axios from 'axios';


function backend(baseUrl) {
    axios.interceptors.request.use(config => {
        config.url = `${baseUrl}/${config.url}/`;
        const token = localStorage.getItem('token');
        if (token) {
            Object.assign(config.headers, { Authorization: `Bearer ${token}` });
        }

        return config;
    });

    axios.interceptors.response.use(response => {
        return response.data;
    });

    return axios;
}

export default backend;
