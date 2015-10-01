import { expect } from 'chai';
import router from '../app/scripts/router.js';

describe('router', function() {
    it('can handle simple rules', () => {
        const routes = router(
            ['#/gallery', '#/compose']
        ).parse('#/gallery');
        expect(routes.gallery).to.deep.equal({});
        expect(routes.compose).to.be.undefined;
    });

    it('can handle layered url', () => {
        const routes = router(
            ['#/compose/edit']
        ).parse('#/compose/edit');
        expect(routes.compose).to.deep.equal({ edit: {} });
    });

    it('can handle rules with params in url', () => {
        const routes = router(
            ['#/gallery/:page']
        ).parse('#/gallery/12');
        expect(routes.gallery).to.deep.equal({ page: '12' });
    });

    it('can handle rules with params in query strings', () => {
        const routes = router(
            ['#/gallery/']
        ).parse('#/gallery?sender=Tom&receiver=Jerry');
        expect(routes.gallery).to.deep.equal({ sender: 'Tom', receiver: 'Jerry' });
    });

    it('can handle rules with params in query strings and url', () => {
        const routes = router(
            ['#/gallery/:page']
        ).parse('#/gallery/12?sender=Tom&receiver=Jerry');
        expect(routes.gallery).to.deep.equal({ sender: 'Tom', receiver: 'Jerry', page: '12' });
    });

    it('can handle shortcut', () => {
        // currently a little messy, implement after refactoring
        //
        // const routes = router(
        //     ['#/detail'],
        //     { shortcut: { '#/detail': '#/compose/preview/fullscreen' } }
        // ).parse('#/detail');
        // expect(routes).to.deep.equal({
        //     detail: {},
        //     compose: {
        //         preview: {
        //             fullscreen: {},
        //         },
        //     },
        // });
    });

    it('tolerate slashes', () => {
        const routes = router(
            ['#/detail']
        ).parse('#/detail////');
        expect(routes.detail).to.deep.equal({});

        const routes2 = router(
            ['#/detail///']
        ).parse('#/detail');
        expect(routes2.detail).to.deep.equal({});
    });
});
