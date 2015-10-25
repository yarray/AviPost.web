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

function updateSearchableDropdown(oldVnode, newVnode) {
    const oldControl = oldVnode.data.searchableDropdown;
    const newControl = newVnode.data.searchableDropdown;

    if (newControl) {
        if (!oldControl) {
            newControl.control = searchableDropdown(newVnode.elm, newControl.params);
        } else {
            newControl.control = oldControl.control;
            newControl.control.update(newControl.params);
        }
    }
}

function update(oldVnode, newVnode) {
    updateMasonry(oldVnode, newVnode);
    updateSearchableDropdown(oldVnode, newVnode);
}

module.exports = { update, create: update };
