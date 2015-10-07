// behavior module for snabbdom
import imagesloaded from 'imagesloaded';


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

export default { create };
