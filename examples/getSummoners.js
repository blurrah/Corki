require('babel/register'); // Using babel for import modules

const Corki = require('../lib/corki');

const corki = new Corki({
    key: 'ae9f9671-09da-40a5-ac73-87815322b972',
    debug: false
});

// Get data from my own Summoner name
corki.getSummonerByName('euw', 'James Cameron').then(function(data) {
    return JSON.parse(data);
}).then(function(data) {
    console.log(data);
}).catch(function(err) {
    console.error(err);
});

// Get a bunch of data from an array of summoner names.
corki.getSummonersByNames('euw', ['James Cameron', 'AT AwesomePossum', 'Sannens']).then(function(data) {
    return JSON.parse(data);
}).then(function(data) {
    var result = [];

    for (var prop in data) {
        result.push(data[prop]);
    }

    console.log(result);
    return result;
}).catch(function(err) {
    console.error(err);
});

corki.getChampions()
