var exec = require('child_process').exec;
var path = require('path');
var url = require('url');
var fs = require('fs');

var webdriver = require('selenium-webdriver');
webdriver.logging.installConsoleHandler();
// webdriver.logging.getLogger().setLevel(webdriver.logging.Level.ALL);


// settings
var backendPath = path.join(__dirname, '../../../AviPost/');
var baseUrl = 'http://127.0.0.1:3000';

// world
var WorldConstructor = function(callback) {
    var manager = path.join(backendPath, 'avipost/manage.py');
    var execPromise = function(cmd) {
        return new Promise(function(resolve, reject) {
            exec(cmd, function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('error: ' + error);
                    console.log(stdout);
                    console.log(stderr);
                    reject(error);
                } else {
                    // console.log(cmd);
                    resolve();
                }
            });
        });
    };

    var fixture = function(creator, args) {
        var cmd = 'python ' + manager + ' fixture ' + creator;
        if (args.length > 0) {
            cmd += ' --par ' + args.join(',');
        }
        return execPromise(cmd);
    };

    var cleandb = function() {
        return execPromise('python ' + manager + ' flush --noinput');
    };

    var absUrl = function(partial) {
        return url.resolve(baseUrl, partial);
    };

    var driver = new webdriver.Builder()
        // .usingServer('http://localhost:4444/wd/hub')
        .withCapabilities(webdriver.Capabilities.chrome())
        // .withCapabilities(webdriver.Capabilities.phantomjs())
        .build();

    driver.waitForVisible = function(selector, timeout) {
        var waitTimeout = timeout || 2000;
        return driver.wait(function() {
            return driver.isElementPresent(webdriver.By.css(selector));
        }, waitTimeout);
    };

    // make dir for screenshots
    var dir = '/tmp/screenshots';
    if (!fs.existsSync(dir)) {
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
