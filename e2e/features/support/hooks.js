var clientSession = function() {
    this.Before(function(callback) {
        this.client.init();
        console.log('session init');
        callback();
    });

    this.After(function(callback) {
        this.client.end();
        console.log('session end');
        callback();
    });
};

module.exports = clientSession;
