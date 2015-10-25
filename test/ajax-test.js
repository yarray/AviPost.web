const sinon = require('sinon');
const { expect } = require('chai');

const ajax = require('../app/scripts/ajax.js');

describe('ajax', () => {
    beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();
    });

    afterEach(function() {
        this.xhr.restore();
    });

    it('can parse simple params', function() {
        ajax(
            'http://127.0.0.1/', 'GET',
            {
                params: {
                    a: 'hello',
                    b: 42,
                    c: 'world',
                },
            })
            .then(() => {
                expect(this.xhr.url).to.be.equal(
                    'http://127.0.0.1/?a=hello&b=42&c=world'
                );
            });
    });

    it('can parse troublesome params', function() {
        ajax(
            'http://127.0.0.1/', 'GET',
            {
                params: {
                    a: 'hell=',
                    b: '42&',
                    c: "'wor ld",
                },
            })
            .then(() => {
                expect(this.xhr.url).to.be.equal(
                    "http://127.0.0.1/?a=hell%3D&b=42%26&c='wor%20ld"
                );
            });
    });
});
