var url = require('url');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

function _requestEndpoint(url, cb) {
    request.getAsync(url)
        .then(function(res) {
            var result = res[0].body;
            cb(result);
        })
        .catch(function(err) {
            console.log(err + ' url: ' + url);
    });
}

var Corki = (function() {

    /**
     * Constructor function
     * @param {object} Options object
     * TODO: Properly define debug mode and use Object.assign() to merge defaults
     */
    function Corki(options) {
        if(!options.key) {
            throw Error('No API Key defined');
        }

        this.key = options.key;

        this.debug = options.debug ? options.debug : false;
    };

    /**
     * Generate Endpoint URL based on options
     * @param {object} Options object containing region and path
     */
    Corki.prototype.generateUrl = function(options) {
        var host = (options.region.toLowerCase() == 'euw') ? 'euw.api.pvp.net' : options.region.toLowerCase();

        return url.format({
            protocol: 'https:',
            host: host + '/api/lol/euw' + options.path,
            query: {api_key: this.key} ,
            region: options.region
        });
    };

    /**
     * Calls private function to request API endpoint
     * @param {string} URL string to call
     * @param {function} Callback function after requesting endpoint
     */
    Corki.prototype.requestEndpoint = function(url, cb) {
        _requestEndpoint.call(this, url, cb);
    };

    /**
     * Get summoner data by name
     * @param {string} region Name or URL of region
     * @param {string} name Summoner name
     */
    Corki.prototype.getSummonerByName = function(region, name) {
        var self = this;
        return new Promise(function(resolve, reject) {

            if(typeof name !== String) {
                reject('Name should be a string');
            }

            name = name.replace(' ', '');

            var url = self.generateUrl({
                region: region,
                path: '/v1.4/summoner/by-name/' + name
            });

            return self.requestEndpoint(url, function(data) {
                resolve(data);
            });

        });
    };

    /**
     * Get multiple summoner's data by using summoner names
     * @param {string} region Name or URL of region
     * @param {array} names Array of summoner names
     */
    Corki.prototype.getSummonersByNames = function(region, names) {
        var self = this;
        return new Promise(function(resolve, reject) {

            if (!(names instanceof Array)) {
                reject({text: 'Parameter names is not an array, you might want to use getSummonerByName if you\'re only using one name'})
            }

            names = names.map(function(val) {
                return val.replace(' ', '');
            });

            var url = self.generateUrl({
                region: region,
                path: '/v1.4/summoner/by-name/' + names
            });

            self.requestEndpoint(url, function(data) {
                resolve(data);
            });

        });
    };

    /**
     * Get summoner information using the summoner id
     * @param {string} region Name or URL of region
     * @param {number} id ID of summoner
     */
    Corki.prototype.getSummonerById = function(region, id) {
        var self = this;
        return new Promise(function(resolve, reject) {

            if(typeof id !== Number) {
                reject('Summoner id is not a number');
            }

            var url = self.generateUrl({
                region: region,
                path: '/v1.4/summoner/' + id
            });

            self.requestEndpoint(url, function(data) {
                resolve(data);
            });
        });
    };

    /**
     * Gets summoner information using the accountname
     * @param {string} region Name or URL of region
     * @param {array|string} account Array of account names or String containing single account name
     */
    Corki.prototype.getSummonerByAccount = function(region, account) {
        var self = this;
        return new Promise(function(resolve, reject) {

            if(typeof account === Array) {
                var names = account.map(function(val) {
                    return val.replace(' ', '');
                });

            } else if(typeof account === String) {
                var names = name.replace(' ', '');
            } else {
                reject('Account id is not a string or array');
            }

            var url = self.generateUrl({
                region: region,
                path: '/v1.4/summoner/by-account/' + names;
            });

            self.requestEndpoint(url, function(data) {
                resolve(data);
            });
        });
    }

    return Corki;
}());

module.exports = Corki;
