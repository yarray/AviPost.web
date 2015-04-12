// The entrance of the app, mainly do routing & dispatching
var page = require('page');

var app = function(config) {
    page('/', '/gallery');
    page('/gallery', function() {
        require('./gallery')(config.uri);
    });
};

// config is a global variable which will be injected when built
app(global.config);
