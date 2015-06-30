require('babel/register');

var Corki = require('../lib/corki');
var chai = require('chai');

describe('Corki', function() {
    var corki;
    var expect = chai.expect;

    it('should return defined API key', function() {
        corki = new Corki({
            key: 'test',
            debug: false
        });

        expect(corki.key).to.equal('test');
    });

    it('should throw an error if no key is defined', function() {
        var badConstructor = function() {
            return new Corki({});
        };

        expect(badConstructor).to.Throw(Error);
    });

    it('should return a debug object if set to true', function() {
        corki = new Corki({
            key: 'test',
            debug: true
        });

        expect(corki.debug).to.be.true;
    });

    describe('generateUrl', function() {
        it('should return an url with the API key', function() {
            corki = new Corki({
                key: 'test',
                debug: true
            });

            var url = corki.generateUrl({
                region: 'euw',
                path: '/test/'
            });

            expect(url).to.equal('https://euw.api.pvp.net/api/lol/euw/test/?api_key=test');
        });

        it('should return an url based on the region URL', function() {
            corki = new Corki({
                key: 'test',
                debug: true
            });

            var url = corki.generateUrl({
                region: 'eune.api.pvp.net',
                path: '/test/'
            });

            expect(url).to.equal('https://eune.api.pvp.net/api/lol/euw/test/?api_key=test');
        });
    });

    describe('getSummonerByName', function() {
        it('should only accept a string for the name object', function() {
            corki = new Corki({
                key: 'test',
                debug: true
            });

            corki.getSummonerByName('euw', 23).catch(function(error) {l
                expect(error).to.equal('Name should be a string');
            })
        });
    });
});
