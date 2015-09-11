/* jshint expr: true */
var common = function() {
    this.World = require('../support/world.js').World;

    this.Given(/^(\w+) received (\d+) postcards$/, function(user, count, done) {
        this.fixture('_postcards', [user, count], done);
    });

    this.Given(/^(\w+) (?:am|are|is) logged in$/, function(user, done) {
        this.token = 'fake_token_' + user;
        this.fixture('_users', [user, this.token], done);
    });
};

module.exports = common;
