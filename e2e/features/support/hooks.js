var clientSession = function() {
    this.Before(function(done) {
        var that = this;

        that.cleandb(function() {
            that.fixture('_oauth', [], function() {
                that.client.init().call(done);
            });
        });
    });

    this.After(function(done) {
        var that = this;
        that.cleandb(function() {
            that.client.end(done);
        });
    });
};

module.exports = clientSession;
