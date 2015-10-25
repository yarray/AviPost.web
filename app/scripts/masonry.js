// masonry adapter for virtual dom

const Masonry = require('masonry-layout');
const imagesloaded = require('imagesloaded');

const searchableDropdown = require('./searchable-dropdown.js');

function updateMasonry(oldVnode, newVnode) {
    const oldMasonry = oldVnode.data.masonry;
    const newMasonry = newVnode.data.masonry;

    if (oldMasonry && !newMasonry) {
        oldMasonry.control.destroy();
        return;
    }

    if (!oldMasonry && newMasonry) {
        newMasonry.control = new Masonry(newVnode.elm, newMasonry);
        imagesloaded(newVnode.elm, () => {
            newMasonry.control.layout();
        });
        return;
    }

    if (oldMasonry && newMasonry) {
        newMasonry.control = oldMasonry.control;
        imagesloaded(newVnode.elm, () => {
            newMasonry.control.layout();
        });
        return;
    }
}

function createSearchableDropdown(vnode) {
    const params = vnode.data.searchableDropdown;

    if (params) {
        searchableDropdown(vnode.elm, params);
    }
}

function update(oldVnode, newVnode) {
    updateMasonry(oldVnode, newVnode);
}

function create(oldVnode, newVnode) {
    updateMasonry(oldVnode, newVnode);
    createSearchableDropdown(newVnode);
}

module.exports = { update, create };
