import type {YMap, YMapTheme} from '@yandex/ymaps3-types';
import {createContainer, CENTER} from '../../../tests/common';
import {YMapRotateTiltControl} from './index';

describe('YMapRotateTiltControl', () => {
    let container: HTMLElement;
    let map: YMap;

    const createMap = (theme?: YMapTheme): void => {
        container = createContainer();
        document.body.append(container);
        map = new ymaps3.YMap(container, {location: {center: CENTER, zoom: 0}, theme});
        const controls = new ymaps3.YMapControls({position: 'right'});
        const rotateTiltControl = new YMapRotateTiltControl({});
        // @ts-ignore Internal and external types do not match
        controls.addChild(rotateTiltControl);
        map.addChild(controls);
    };

    const getRingElement = (): HTMLElement | null => document.querySelector('.ymaps3--rotate-tilt_rotate__ring');
    const getTiltElement = (): HTMLElement | null => document.querySelector('.ymaps3--rotate-tilt_tilt');

    afterEach(() => {
        map.destroy();
        container.remove();
    });

    it('propagates the dark theme to both nested controls', () => {
        createMap('dark');
        expect(getRingElement()?.classList.contains('ymaps3--rotate-tilt_rotate__ring_dark')).toBe(true);
        expect(getTiltElement()?.classList.contains('ymaps3--rotate-tilt_tilt__dark')).toBe(true);
    });

    it('does not apply the dark class to nested controls in the light theme', () => {
        createMap('light');
        expect(getRingElement()?.classList.contains('ymaps3--rotate-tilt_rotate__ring_dark')).toBe(false);
        expect(getTiltElement()?.classList.contains('ymaps3--rotate-tilt_tilt__dark')).toBe(false);
    });

    it('toggles the dark class on both nested controls when the map theme changes', () => {
        createMap('light');
        const ringElement = getRingElement();
        const tiltElement = getTiltElement();

        map.update({theme: 'dark'});
        expect(ringElement?.classList.contains('ymaps3--rotate-tilt_rotate__ring_dark')).toBe(true);
        expect(tiltElement?.classList.contains('ymaps3--rotate-tilt_tilt__dark')).toBe(true);

        map.update({theme: 'light'});
        expect(ringElement?.classList.contains('ymaps3--rotate-tilt_rotate__ring_dark')).toBe(false);
        expect(tiltElement?.classList.contains('ymaps3--rotate-tilt_tilt__dark')).toBe(false);
    });
});
