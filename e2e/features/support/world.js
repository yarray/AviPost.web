var exec = require('child_process').exec;
var path = require('path');
var url = require('url');
var fs = require('fs');

var webdriverio = require('webdriverio');
var chai = require('chai');

// settings
var backendPath = path.join(__dirname, '../../../AviPost/');
var seleniumOptions = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
var baseUrl = 'http://127.0.0.1:3000';

// world
var WorldConstructor = function(callback) {
    // TODO should be more specific
    var initFixture = function(callback) {
        var manager = path.join(backendPath, 'avipost/manage.py');
        var fixture = path.join(backendPath, 'e2e/fixtures/postcards.py');

        exec('python ' + manager + ' shell_plus < ' + fixture, callback);
    };

    var absUrl = function(partial) {
        return url.resolve(baseUrl, partial);
    };

    var client = webdriverio.remote(seleniumOptions);
    client.on('error', function(e) {
        // will be executed everytime an error occured
        // e.g. when element couldn't be found
        console.log(e);   // -> "org.openqa.selenium.NoSuchElementException"
    });

    // use chai
    chai.should();

    // make dir for screenshots
    var dir = '/tmp/screenshots';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    callback({
        initFixture: initFixture,
        client: client,
        absUrl: absUrl
    });
};

module.exports.World = WorldConstructor;
