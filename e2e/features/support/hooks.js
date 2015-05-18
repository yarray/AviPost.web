var clientSession = function() {
    this.Before(function(done) {
        this.client.init().then(done);
    });

    this.After(function(done) {
        this.client.end().then(done);
    });
};

module.exports = clientSession;
