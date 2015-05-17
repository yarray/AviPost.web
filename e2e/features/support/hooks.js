var clientSession = function () {
    this.Before(function(callback) {
        this.client.init();
        callback();
    });

    this.After(function(callback) {
        this.client.end();
        callback();
    });
};

module.exports = clientSession;
