var ajax = require('../app/scripts/ajax.js');

describe('param parser', function() {
    var params = ajax.params;

    it('can parse simple params', function() {
        expect(params({
            a: 'hello',
            b: 42,
            c: 'world'
        })).to.be.equal(
            'a=hello&b=42&c=world'
        );
    });

    it('can parse troublesome params', function() {
        expect(params({
            a: 'hell=',
            b: '42&',
            c: "'wor ld"
        })).to.be.equal(
            "a=hell%3D&b=42%26&c='wor%20ld"
        );
    });
});
