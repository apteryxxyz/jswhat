const http = require('http');
const https = require('https');

const nodeFetch = noThrow(() => require('node-fetch'));
const request = noThrow(() => require('request'));

function noThrow(fn) {
    try {
        return fn();
    } catch { };
}

class URLHandler {
    constructor() {
        let method;
        if (!!nodeFetch) method = (url) => nodeFetch(url).then(res => res.text());
        else if (!!request) method = (url) => new Promise(resolve => request.get(new URL(url), { json: true }, (err, res, body) => resolve(err || body)));
        else method = (url) => new Promise(resolve => {
            url = new URL(url);
            (url.protocol === 'https:' ? https : http).get(url.href, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk.toString());
                res.on('end', () => resolve(data));
                res.on('error', resolve)
            }).on('error', resolve);
        })

        this.setFetchMethod(method);
    }

    setFetchMethod(fn) {
        this.fetch = fn;
    }

    isURL(string, easyMode = false) {
        try {
            let url = new URL(string);
            if (easyMode === true) return true;
            else return !!url.protocol.match(/https?:/);
        } catch {
            return false
        }
    }

    fetchURL(url) {
        if (!this.isURL(url)) return Error(`[jswhat] Invalid URL: ${url}`);
        return this.fetch(url)
            .then(data => {
                if (data instanceof Error) throw data;
                else return data.split(/\s/g).filter(x => x);
            })
            .catch(err => {
                console.error(err);
                if (err.code === 'ETIMEDOUT') return Error(`[jswhat] Request to ${url} timed out`);
                else if (err.code === 'ENOTFOUND') return Error(`[jswhat] Host ${url} not found`);
                else return err;
            });
    }
}

module.exports = exports = URLHandler;