import type {YMap, YMapTheme} from '@yandex/ymaps3-types';
import {createContainer, CENTER} from '../../../tests/common';
import {YMapTiltControl} from './index';

describe('YMapTiltControl', () => {
    let container: HTMLElement;
    let map: YMap;

    const createMap = (theme?: YMapTheme): void => {
        container = createContainer();
        document.body.append(container);
        map = new ymaps3.YMap(container, {location: {center: CENTER, zoom: 0}, theme});
        const controls = new ymaps3.YMapControls({position: 'right'});
        const tiltControl = new YMapTiltControl({});
        controls.addChild(tiltControl);
        map.addChild(controls);
    };

    const getTiltElement = (): HTMLElement | null => document.querySelector('.ymaps3--tilt');

    afterEach(() => {
        map.destroy();
        container.remove();
    });

    it('does not apply the dark class in the light theme', () => {
        createMap('light');
        expect(getTiltElement()?.classList.contains('ymaps3--tilt_dark')).toBe(false);
    });

    it('applies the dark class when the map theme is dark', () => {
        createMap('dark');
        expect(getTiltElement()?.classList.contains('ymaps3--tilt_dark')).toBe(true);
    });

    it('toggles the dark class when the map theme changes', () => {
        createMap('light');
        const element = getTiltElement();
        expect(element?.classList.contains('ymaps3--tilt_dark')).toBe(false);

        map.update({theme: 'dark'});
        expect(element?.classList.contains('ymaps3--tilt_dark')).toBe(true);

        map.update({theme: 'light'});
        expect(element?.classList.contains('ymaps3--tilt_dark')).toBe(false);
    });
});
