/* jshint expr: true */
var gallery = function() {
    this.World = require("../support/world.js").World;

    this.When(/^I open the app$/, function(done) {
        this.client.url(this.absUrl('/')).then(done);
    });

    this.When(/^I visit my gallery$/, function(done) {
        this.client.url(this.absUrl('#!/gallery')).then(done);
    });

    this.Then(/^I see the gallery$/, function(done) {
        this.client.isVisible('#gallery').then(function(visible) {
            visible.should.be.true;
        }).then(done);
    });

    this.Then(/^with (\d+) figures/, function(count, done) {
        this.client.elements('figure').then(function(res) {
            // count + 1 template
            res.value.should.have.length(parseInt(count, 10) + 1);
        }).then(done);
    });
};

module.exports = gallery;
