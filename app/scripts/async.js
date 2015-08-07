/* @flow */
// async operations as promise
import imagesLoaded from 'imagesloaded';

// since loadImage is an event and will not resolve to value, we can give one
function loadImage/*:: <T> */ (
    container /*: Element */ ,
    value /*: T */
) /*: Promise<T> */ {
    return new Promise((resolve, reject) => {
        imagesLoaded(container, () => {
            resolve(value);
        });
    });
}

export default { loadImage };
