/* jshint expr: true */
var By = require('selenium-webdriver').By;
var expect = require('chai').expect;

var gallery = function() {
    this.World = require('../support/world.js').World;

    this.When(/^I visit my gallery$/, function() {
        return this.client.get(this.absUrl('#/gallery'));
    });

    this.Then(/^I see the gallery$/, function() {
        return this.client.waitForVisible('#gallery', 1000);
    });

    this.Then(/^with (\d+) figures/, function(count) {
        var client = this.client;
        return client.sleep(1000)
            .then(function() {
                return client.findElements(By.css(':not([data-template]) > figure'));
            })
            .then(function(res) {
                return expect(res).to.have.length(parseInt(count, 10));
            });
    });
};

module.exports = gallery;
