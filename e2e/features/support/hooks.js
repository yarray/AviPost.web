var fs = require('fs');
var path = require('path');


var clientSession = function() {

    this.Before(function(scenario, done) {
        var that = this;

        that.cleandb(function() {
            that.fixture('_oauth', [], function() {
                done();
            });
        });
    });

    this.After(function(scenario, done) {
        var that = this;

        that.client.takeScreenshot().then(function(data) {
            if (scenario.isFailed()) {
                var base64Data = data.replace(/^data:image\/png;base64,/, '');
                // TODO hard coded path
                fs.writeFile(path.join(
                    '/tmp/screenshots',
                    (scenario.getName() + '.png').replace(/ /g, '_')), base64Data, 'base64',
                    function(err) {
                        if (err) console.log(err);
                    });
            }
        }).then(function() { 
            that.cleandb();
        }).then(function() {
            that.client.quit().then(done);
        });
    });
};

module.exports = clientSession;
