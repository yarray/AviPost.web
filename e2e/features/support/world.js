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
    var manager = path.join(backendPath, 'avipost/manage.py');

    var fixture = function(creator, args, callback) {
        exec('python ' + manager + ' fixture ' + creator + ' --par ' + args.join(','), callback);
    };

    var cleandb = function(callback) {
        exec('python ' + manager + ' flush --no-input', callback);
    };

    var absUrl = function(partial) {
        return url.resolve(baseUrl, partial);
    };

    var client = webdriverio.remote(seleniumOptions);
    client.on('error', function(e) {
        // will be executed everytime an error occured
        // e.g. when element couldn't be found
        console.error(e);   // -> "org.openqa.selenium.NoSuchElementException"
    });

    // use chai
    chai.should();

    // make dir for screenshots
    var dir = '/tmp/screenshots';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    callback({
        fixture: fixture,
        cleandb: cleandb,
        client: client,
        absUrl: absUrl
    });
};

module.exports.World = WorldConstructor;
