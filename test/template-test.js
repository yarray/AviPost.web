var template = require('../app/scripts/template.js');

require('mocha-jsdom')();

describe('template', function() {
    it('can render template to html', function() {
        expect(template.render2html({
            a: 1,
            b: 2
        }, '<li attr="{{a}}">{{a}}+{{b}}</li>')).to.be.equal(
            '<li attr="1">1+2</li>'
        );
    });

    it('can render template', function() {
        var tmpl = document.createElement('li');
        tmpl.id = "unique";
        tmpl.innerHTML = '<img src="//:0" data-src="{{url}}">{{b}}</img>';
        expect(template.render({
            url: 'http://1.com/1.png',
            b: 2
        }, tmpl).outerHTML).to.be.equal(
            '<li><img src="http://1.com/1.png">2</li>'
        );
    });
});
