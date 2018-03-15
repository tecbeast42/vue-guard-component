import axios from 'axios';
import { debounce } from 'lodash';

/**
 *   Bundles request for urls
 */
export class RequestBundler {
    constructor () {
        this.requests = {};
        this.waitTime = 200;
        this.debounce = debounce(this.sendRequests.bind(this), this.waitTime);
    }

    static bundleRequest (url, data) {
        if (!Object.keys(requestBundler.requests).includes(url)) {
            requestBundler.requests[url] = [];
        }

        return new Promise((resolve, reject) => {
            requestBundler.requests[url].push({ reject, resolve, data });
            requestBundler.debounce(url);
        });
    }

    sendRequests (url) {
        let resources = this.requests[url].map(r => r.data);
        let request = this.requests[url];

        this.requests[url] = [];

        this.checkResourcesPost(url, resources, request);
    }

    checkResourcesPost (url, resources, request) {
        axios.post(url, { resources }).then((response) => {
            let responses = response.data;

            responses.forEach((responseResource, index) => {
                if (responseResource.status !== 200) {
                    request[index].reject(responseResource.data);
                }

                request[index].resolve(responseResource.data);
            });
        }, ({ response }) => {
            request.forEach(({ reject }) => {
                reject(response);
            });
        });
    }
}

export const requestBundler = new RequestBundler();
