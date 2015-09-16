/* jshint expr: true */
var common = function() {
    this.World = require('../support/world.js').World;

    this.When(/^I open the app$/, function() {
        return this.client.get(this.absUrl('/'));
    });

    this.Given(/^(\w+) received (\d+) postcards$/, function(user, count) {
        return this.fixture('_postcards', [user, count]);
    });

    this.Given(/^(\w+) (?:am|are|is) logged in$/, function(user) {
        var that = this;
        var client = this.client;
        var token = 'fake_token_' + user;

        // Visit homepage so we can set localStorage
        return client.get(this.absUrl('/'))
            .then(function() {
                return that.fixture('_users', [user, token]);
            })
            .then(function() {
                return client.executeScript(function(token) {
                    localStorage.setItem('token', token); // eslint-disable-line
                }, token);
            })
            .then(function() {
                // return to blank page so we can do a fresh visit later
                return client.get('about:blank');
            });
    });
};

module.exports = common;
