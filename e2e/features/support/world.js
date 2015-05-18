var exec = require('child_process').exec;
var path = require('path');
var url = require('url');

var webdriverio = require('webdriverio');
var chai = require('chai');

// settings
var backendPath = path.join(__dirname, '../../../AviPost/');
var seleniumOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};
var baseUrl = 'http://127.0.0.1:3000';

// world
var WorldConstructor = function(callback) {
    var initFixture = function(callback) {
        var manager = path.join(backendPath, 'avipost/manage.py');
        var fixture = path.join(backendPath, 'e2e/client/fixtures.py');

        exec('python ' + manager + ' shell_plus < ' + fixture, callback);
    };

    var absUrl = function(partial) {
        return url.resolve(baseUrl, partial);
    };

    var client = webdriverio.remote(seleniumOptions);
    // use chai
    chai.should();

    callback({
        initFixture: initFixture,
        client: client,
        absUrl: absUrl
    });
};

module.exports.World = WorldConstructor;
