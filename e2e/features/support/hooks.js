var clientSession = function() {
    this.Before(function(done) {
        this.client.init().call(done);
    });

    this.After(function(done) {
        this.client.end(done);
    });
};

module.exports = clientSession;
