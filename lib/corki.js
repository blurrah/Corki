import url from 'url';
import Promise from 'bluebird';
const request = Promise.promisifyAll(require('request'));

export default class Corki {
    constructor(options) {
        if(!options.key) {
            throw new Error('No API Key defined');
        }

        this.key = options.key;

        if (options.debug) this.debug = true;
    }

    generateUrl(options) {
        let host = (options.region.toLowerCase() == 'euw') ? 'euw.api.pvp.net' : options.region.toLowerCase();

        return url.format({
            protocol: 'https:',
            host: host + '/api/lol/euw' + options.path,
            query: {api_key: this.key || options.key} ,
            region: options.region
        });
    }

    requestEndpoint(url, cb) {
        request.getAsync(url)
            .then(function(res) {
                let result = res[0].body;
                cb(result);
            }).catch((err) => console.log(err + ' url: ' + url));
    }

    static getChampions(region, fp) {
        return new Promise(function(resolve, reject) {

            if(typeof fp !== 'boolean') {
                fp = false;
            }

            let url = this.generateUrl({
                region: region,
                path: '/v1.2/champion',
                query: {
                    freeToPlay: Boolean(fp)
                }
            });

            this.requestEndpoint.then((url) => {
                resolve(url);
            }).catch((err) => {
                reject(err);
            });
        });

    }

    /**
     * Get summoner data by name
     * @param {string} region Name or URL of region
     * @param {string} name Summoner name
     */
    getSummonerByName(region, name) {
        let self = this;
        return new Promise(function(resolve, reject) {

            name = name.replace(' ', '');

            let url = self.generateUrl({
                region: region,
                path: '/v1.4/summoner/by-name/' + name
            });

            return self.requestEndpoint(url, function(data) {
                resolve(data);
            });

        });
    }

    /**
     * Get multiple summoner's data by using summoner names
     * @param {string} region Name or URL of region
     * @param {array} names Array of summoner names
     */
    getSummonersByNames(region, names) {
        let self = this;
        return new Promise(function(resolve, reject) {

            if (!(names instanceof Array)) {
                reject({text: 'Parameter names is not an array, you might want to use getSummonerByName if you\'re only using one name'})
            }

            names = names.map(val => val.replace(' ', ''));

            let url = self.generateUrl({
                region: region,
                path: '/v1.4/summoner/by-name/' + names
            });

            self.requestEndpoint(url, function(data) {
                resolve(data);
            });

        });
    }

    static getSummonerBySummonerId(region, summonerId) {
        return new Promise(function(resolve, reject) {

            let url = this.generateUrl({
                region: region,
                path: '/v1.4/summoner/' + summonerId
            });

            this.requestEndpoint.then((url) => {
                resolve(url);
            }).catch((err) => {
                reject(err);
            });

        });


    }

}
