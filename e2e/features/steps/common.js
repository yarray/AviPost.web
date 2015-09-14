/* jshint expr: true */
var common = function() {
    this.World = require('../support/world.js').World;

    this.When(/^I open the app$/, function() {
        return this.client.get(this.absUrl('/'));
    });

    this.Given(/^(\w+) received (\d+) postcards$/, function(user, count, done) {
        this.fixture('_postcards', [user, count], done);
    });

    this.Given(/^(\w+) (?:am|are|is) logged in$/, function(user, done) {
        var client = this.client;
        var token = 'fake_token_' + user;

        // this.fixture('_users', [user, token], function() {
        //     client.executeScript(function(token) {
        //         localStorage.setItem('token', token);
        //     }, token).then(function() {
        //         done();
        //     });
        // });
        this.fixture('_users', [user, token], function() {
            client.executeScript('localStorage.setItem("token", "' + token + '")').then(function() {
                done();
            });
        });

    });
};

module.exports = common;
