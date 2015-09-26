// async operations as promise
import imagesLoadedOrigin from 'imagesloaded';

/**
 * loadImage
 * since loadImage is an event and will not resolve to value, we can give one
 *
 * @param {HTMLElement} container
 * @param {T} value
 * @return {Promise.<T>}
 * @template T
 */
function imagesLoaded(container, value) {
    return new Promise((resolve) => {
        imagesLoadedOrigin(container, () => {
            resolve(value ? value : true);
        });
    });
}

export default { imagesLoaded };
