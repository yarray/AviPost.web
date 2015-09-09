/* jshint expr: true */
var common = function() {
    this.World = require('../support/world.js').World;


    this.Given(/^(\w+) received (\d+) postcards$/, function(user, count, done) {
        // TODO after fixture creation can better handle parameters, this should be
        // set specifically
        this.initFixture(done);
    });

    this.Given(/^(\w+) am|are|is logged in$/, function(user, done) {
        // currently we do not handle user
        done();
    });
};

module.exports = common;
