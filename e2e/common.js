module.exports = {
    'test Title': function(client) {
        client
            .url(client.launch_url)
            .waitForElementVisible('body', 1000)
            .assert.title('AviPost')
            .end();
    }
};
