import {API} from './config';

export const SchoolAPI = {
    post: (url, data) => new Promise(
        (resolve, reject) => {
            API.post(url, data)
                .then(
                    res => res.data
                )
                .then(
                    data => resolve(data)
                )
                .catch(
                    err => reject(err)
                )
        }
    ),
    get: (url) => new Promise(
        (resolve, reject) => {
            API.get(url)
                .then(
                    res => res.data
                )
                .then(
                    data => resolve(data)
                )
                .catch(
                    err => reject(err)
                )
        }
    ),
    put: (url, data) => new Promise(
        (resolve, reject) => {
            API.put(url, data)
                .then(
                    res => res.data
                )
                .then(
                    data => resolve(data)
                )
                .catch(
                    err => reject(err)
                )
        }
    ),
    delete: (url, data) => new Promise(
        (resolve, reject) => {
            API.delete(url, data)
                .then(
                    res => res.data
                )
                .then(
                    data => resolve(data)
                )
                .catch(
                    err => reject(err)
                )
        }
    )
};