// masonry adapter for virtual dom

const Masonry = require('masonry-layout');
const imagesloaded = require('imagesloaded');

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

function update(oldVnode, newVnode) {
    updateMasonry(oldVnode, newVnode);
}

module.exports = { update, create: update };
