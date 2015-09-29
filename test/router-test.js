import { expect } from 'chai';
import router from '../app/scripts/router.js';

describe('router', function() {
    it('can redirect simple url', () => {
        const r = router(
            {
                gallery: '/gallery',
                compose: '/compose',
            }
        );
        const routes = r('/gallery');
        expect(routes.gallery).to.be.true;
        expect(routes.compose).to.be.false;
    });
});
