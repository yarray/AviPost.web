const { expect } = require('chai');
const snabbdom = require('snabbdom');

const searchableDropdown = require('../app/scripts/searchable-dropdown.js');

describe('searchable dropdown', () => {
    beforeEach(function() {
        this.elm = document.createElement('div');
        this.vnode0 = this.elm;

        this.patch = snabbdom.init([
            require('snabbdom/modules/props'),
            require('snabbdom/modules/class'),
            require('snabbdom/modules/attributes'),
            require('snabbdom/modules/eventlisteners'),
        ]);

        this.input = () => this.elm.firstElementChild;
        this.ul = () => this.elm.children[1];
    });

    it('should display list values', function() {
        searchableDropdown(this.vnode0, [
            { name: 'Tom', value: 1 },
            { name: 'Sheep', value: 2 },
        ]);

        expect(this.input().tagName).to.equal('INPUT');
        expect(this.ul().children).to.have.length(2);
        expect(this.ul().children[0].textContent).to.equal('Tom');
        expect(this.ul().children[1].getAttribute('data-value')).to.equal('2');
    });

    it('should filter when typing', function() {
        searchableDropdown(this.vnode0, [
            { name: 'Tom', value: 1 },
            { name: 'Sheep', value: 2 },
        ]);

        this.input().value = 'She';
        this.input().dispatchEvent(new Event('change'));

        expect(this.ul().children).to.have.length(1);
        expect(this.ul().children[0].textContent).to.equal('Sheep');
    });

    it.only('should hide dropdown until input is focused', function() {
        searchableDropdown(this.vnode0, []);

        expect(this.ul().style.display).to.equal('none');
        this.input().focus();
        expect(this.ul().style.display).not.to.equal('none');
        this.input().blur();
        expect(this.ul().style.display).to.equal('none');
    });
});
