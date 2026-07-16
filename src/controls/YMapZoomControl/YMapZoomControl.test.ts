import {YMapZoomControl} from './index';

describe('YMapZoomControl', () => {
    const container = document.createElement('div');
    Object.assign(container.style, {width: '640px', height: '480px'});
    document.body.append(container);

    describe('zoom controls disabled', () => {
        it('works', () => {
            const map = new ymaps3.YMap(container, {
                zoomRange: {min: 5, max: 10},
                location: {center: [0, 0], zoom: 0}
            });
            const controls = new ymaps3.YMapControls({position: 'right'});
            const zoomControl = new YMapZoomControl({});
            // @ts-ignore Internal and external types do not match
            controls.addChild(zoomControl);
            map.addChild(controls);

            const getZoomControlStatus = (zoomControl: 'in' | 'out'): boolean => {
                return (
                    document.querySelector(`.ymaps3--zoom-control__${zoomControl}`)
                        ?.parentElement as HTMLButtonElement
                ).disabled;
            };

            map.setLocation({zoom: map.zoomRange.max});
            expect(getZoomControlStatus('in')).toBe(true);
            expect(getZoomControlStatus('out')).toBe(false);

            map.setLocation({zoom: map.zoomRange.min});
            expect(getZoomControlStatus('out')).toBe(true);
            expect(getZoomControlStatus('in')).toBe(false);

            map.destroy();
        });
    });

    describe('dark theme', () => {
        it('toggles the dark classes together with the map theme', () => {
            const map = new ymaps3.YMap(container, {
                location: {center: [0, 0], zoom: 0},
                theme: 'light'
            });
            const controls = new ymaps3.YMapControls({position: 'right'});
            const zoomControl = new YMapZoomControl({});
            // @ts-ignore Internal and external types do not match
            controls.addChild(zoomControl);
            map.addChild(controls);

            const zoomIn = document.querySelector('.ymaps3--zoom-control__in');
            const zoomOut = document.querySelector('.ymaps3--zoom-control__out');

            expect(zoomIn?.classList.contains('ymaps3--zoom-control__dark-in')).toBe(false);
            expect(zoomOut?.classList.contains('ymaps3--zoom-control__dark-out')).toBe(false);

            map.update({theme: 'dark'});
            expect(zoomIn?.classList.contains('ymaps3--zoom-control__dark-in')).toBe(true);
            expect(zoomOut?.classList.contains('ymaps3--zoom-control__dark-out')).toBe(true);

            map.update({theme: 'light'});
            expect(zoomIn?.classList.contains('ymaps3--zoom-control__dark-in')).toBe(false);
            expect(zoomOut?.classList.contains('ymaps3--zoom-control__dark-out')).toBe(false);

            map.destroy();
        });
    });
});
