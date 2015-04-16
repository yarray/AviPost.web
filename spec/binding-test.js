var binding = require('../app/scripts/binding.js');

describe('binding', function() {
    var render = binding.render;

    it('can render template', function() {
        expect(render({
            a: 1,
            b: 2
        }, '<li attr="{{a}}">{{a}}+{{b}}</li>')).to.be.equal(
            '<li attr="1">1+2</li>'
        );
    });
});
