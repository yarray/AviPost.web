var exec = require('child_process').exec;
var path = require('path');
var url = require('url');
var fs = require('fs');

var webdriver = require('selenium-webdriver');

// settings
var backendPath = path.join(__dirname, '../../../AviPost/');
var baseUrl = 'http://127.0.0.1:3000';

// world
var WorldConstructor = function(callback) {
    var manager = path.join(backendPath, 'avipost/manage.py');

    var fixture = function(creator, args, callback) {
        var cmd = 'python ' + manager + ' fixture ' + creator;
        if (args.length > 0) {
            cmd += ' --par ' + args.join(',');
        }
        exec(cmd, callback);
    };

    var cleandb = function(callback) {
        exec('python ' + manager + ' flush --no-input', callback);
    };

    var absUrl = function(partial) {
        return url.resolve(baseUrl, partial);
    };

    var driver = new webdriver.Builder().
        withCapabilities(webdriver.Capabilities.phantomjs()).
        build();

    driver.waitForVisible = function(selector, timeout) {
        var waitTimeout = timeout || 2000;
        return driver.wait(function() {
            return driver.isElementPresent(webdriver.By.css(selector));
        }, waitTimeout);
    };

    // make dir for screenshots
    var dir = '/tmp/screenshots';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    callback({
        fixture: fixture,
        cleandb: cleandb,
        client: driver,
        absUrl: absUrl
    });
};

module.exports.World = WorldConstructor;
