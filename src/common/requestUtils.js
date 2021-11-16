const BASE_URL = document.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://api.mkondo.co';

// Ensure you are running a local instance
const URL = BASE_URL;

const buildUrl = (url, data) => {
    const newUrl = `${URL}/${url}`;
    const headers = {
        'Access-Control-Allow-Origin': '*',
    };

    const props = {
        url: newUrl,
        headers,
    };

    if (data) {
        props.body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
    }

    return props;
};

export const buildFormData = (url, data = {}, baseUrl = BASE_URL) => {
    const newUrl = `${baseUrl}${url}`;

    const headers = {
        'Accept': '*/*',
    };

    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    return {
        body: formData,
        url: newUrl,
        headers,
    };
};

export const handleFetch = async(method, path, data, token = '', baseUrl, onProgressCallback) => {
    let url, headers;

    const props = {};

    if (data && data.file) {
        // console.log("File Upload", path);
        const res = buildFormData(`/${path}`, data, baseUrl);
        url = res.url;
        headers = res.headers;
        props.body = res.body;

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        // console.log("File Upload -> Returning Promise");
        return await new Promise((resolve, reject) => {
            // console.log("File Upload -> Promise -> Create Request");
            let request = new XMLHttpRequest();
            request.open(method,`${URL}/${url}`);

            //upload progress event
            request.upload.addEventListener('progress', (e) => {
                //upload progress as percentage
                let progress = (e.loaded/e.total)*100;
                if (onProgressCallback) onProgressCallback(progress, e.loaded, e.total);
                // console.log(`File Upload -> Progress: ${progress}%`);
            });

            //request finished event
            request.addEventListener('load', (e) => {
                //http status message
                if (onProgressCallback) onProgressCallback(0);
                const status = request.status;
                const result = request.response;
                // console.log(`File Upload -> Complete`, status, result, url);
                if (![200, 201, 204].includes(status)) {
                    reject(result);
                    return;
                }
            
                if ([204].includes(status)) {
                    resolve(true);
                    return;
                }
            
                resolve(JSON.parse(result));
                return;
            });

            //setting the request headers
            for (const key in headers) {
                request.setRequestHeader(key, headers[key]);
            }
            // console.log("File Upload -> Sending the Request");
            request.send(props.body);
        })
    } else {
        const res = buildUrl(path, data);
        url = res.url;
        headers = res.headers;

        if (res.body) {
            props.body = res.body;
        }

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...props,
            headers,
            method,
        });

        const status = response.status;
        const result = await response.text();
    
        if (![200, 201, 204].includes(status)) {
            throw result;
        }
    
        if ([204].includes(status)) {
            return true
        }
    
        return JSON.parse(result);
    }
}