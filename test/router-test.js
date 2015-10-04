import { expect } from 'chai';
import router from '../app/scripts/router.js';

describe('router', function() {
    it('handles simple rules', () => {
        const routes = router(
            ['#/gallery', '#/compose']
        )('/gallery');
        expect(routes.gallery).to.deep.equal({});
        expect(routes.compose).to.be.undefined;
    });

    it('handles layered url', () => {
        const routes = router(
            ['#/compose/edit']
        )('/compose/edit');
        expect(routes.compose).to.deep.equal({ edit: {} });
    });

    it('handles rules with params in url', () => {
        const routes = router(
            ['#/gallery/:page']
        )('/gallery/12');
        expect(routes.gallery).to.deep.equal({ page: '12' });
    });

    it('handles rules with params in query strings', () => {
        const routes = router(
            ['#/gallery/']
        )('/gallery?sender=Tom&receiver=Jerry');
        expect(routes.gallery).to.deep.equal({ sender: 'Tom', receiver: 'Jerry' });
    });

    it('handles rules with params in query strings and url', () => {
        const routes = router(
            ['#/gallery/:page']
        )('/gallery/12?sender=Tom&receiver=Jerry');
        expect(routes.gallery).to.deep.equal({ sender: 'Tom', receiver: 'Jerry', page: '12' });
    });

    it('handles shortcut', () => {
        const routes = router(
            ['#/detail'],
            { shortcut: { '#/detail': '#/compose/preview/fullscreen' } }
        )('/detail');
        expect(routes).to.deep.equal({
            compose: {
                preview: {
                    fullscreen: {},
                },
            },
        });
    });

    it('handles shortcut with params in url', () => {
        const routes = router(
            ['#/detail/:id'],
            { shortcut: { '#/detail/:id': '#/compose/preview/:id/fullscreen' } }
        )('/detail/12');
        expect(routes).to.deep.equal({
            compose: {
                preview: {
                    id: '12',
                    fullscreen: {},
                },
            },
        });
    });

    it('handles shortcut with empty url', () => {
        const routes = router(
            ['#/', '#/gallery', '#/compose'],
            { shortcut: { '#/': '#/compose' } }
        )('/');
        expect(routes).to.deep.equal({
            compose: {},
        });
    });

    it('tolerates slashes', () => {
        const routes = router(
            ['#/detail']
        )('#/detail////');
        expect(routes.detail).to.deep.equal({});

        const routes2 = router(
            ['#/detail///']
        )('#/detail');
        expect(routes2.detail).to.deep.equal({});
    });
});
