// masonry adapter for virtual dom

import Masonry from 'masonry-layout';
import { equals } from 'ramda';
import imagesloaded from 'imagesloaded';


function update(oldVnode, newVnode) {
    const oldMasonry = oldVnode.data.masonry;
    const newMasonry = newVnode.data.masonry;

    if (!oldMasonry && !newMasonry) {
        return;
    }

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

export default { update, create: update };
