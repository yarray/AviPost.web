/* jshint expr: true */
var common = function() {
    this.World = require("../support/world.js").World;

    this.Given(/^server has demo data$/, function(done) {
        this.initFixture(done);
    });

    this.Given(/^I am demo$/, function(done) {
        // currently we do not handle user
        done();
    });
};

module.exports = common;
