module.exports = {
    'test Title': function(client) {
        var postcards = require('../AviPost/avipost/fixtures/postcards.json');
        client
            .url(client.launch_url)
            .waitForElementVisible('body', 1000)
            .assert.title('AviPost')
            .end();
    }
};
