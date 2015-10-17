// behavior module for snabbdom
const imagesloaded = require('imagesloaded');


function create(_, newVnode) {
    const behaviors = newVnode.data.behavior;
    if (!newVnode.data.behavior) {
        return;
    }

    if (behaviors.hideTillImagesLoaded) {
        newVnode.elm.style.display = 'none';
        imagesloaded(
            newVnode.elm,
            () => newVnode.elm.style.display = null
        );
    }
}


module.exports = { create };
