// async operations as promise
import imagesLoaded from 'imagesloaded';

/**
 * loadImage
 * since loadImage is an event and will not resolve to value, we can give one
 *
 * @param {HTMLElement} container
 * @param {T} value
 * @return {Promise.<T>}
 * @template T
 */
function loadImage(container, value) {
    return new Promise((resolve) => {
        imagesLoaded(container, () => {
            resolve(value);
        });
    });
}

export default { loadImage };
