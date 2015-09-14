/* jshint expr: true */
var common = function() {
    this.World = require('../support/world.js').World;

    this.Given(/^(\w+) received (\d+) postcards$/, function(user, count, done) {
        this.fixture('_postcards', [user, count], done);
    });

    this.Given(/^(\w+) (?:am|are|is) logged in$/, function(user, done) {
        var client = this.client;
        var token = 'fake_token_' + user;

        this.fixture('_users', [user, token], function() {
            // inject js here, since webdriverio's localstorage API not work 
            // TODO not work
            client.execute('localStorage.setItem("token", "' + token + '");').then(function(ret) {
                console.log('hi'); // outputs: 10
                console.log(ret.value); // outputs: 10
            });
        });
    });
};

module.exports = common;
