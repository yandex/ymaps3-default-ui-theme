import type {YMap, YMapTheme} from '@yandex/ymaps3-types';
import {createContainer, CENTER} from '../../../tests/common';
import {YMapRotateControl} from './index';

describe('YMapRotateControl', () => {
    let container: HTMLElement;
    let map: YMap;

    const createMap = (theme?: YMapTheme): void => {
        container = createContainer();
        document.body.append(container);
        map = new ymaps3.YMap(container, {location: {center: CENTER, zoom: 0}, theme});
        const controls = new ymaps3.YMapControls({position: 'right'});
        const rotateControl = new YMapRotateControl({});
        // @ts-ignore Internal and external types do not match
        controls.addChild(rotateControl);
        map.addChild(controls);
    };

    const getRotateElement = (): HTMLElement | null => document.querySelector('.ymaps3--rotate-control');

    afterEach(() => {
        map.destroy();
        container.remove();
    });

    it('does not apply the dark class in the light theme', () => {
        createMap('light');
        expect(getRotateElement()?.classList.contains('ymaps3--rotate-control_dark')).toBe(false);
    });

    it('applies the dark class when the map theme is dark', () => {
        createMap('dark');
        expect(getRotateElement()?.classList.contains('ymaps3--rotate-control_dark')).toBe(true);
    });

    it('toggles the dark class when the map theme changes', () => {
        createMap('light');
        const element = getRotateElement();
        expect(element?.classList.contains('ymaps3--rotate-control_dark')).toBe(false);

        map.update({theme: 'dark'});
        expect(element?.classList.contains('ymaps3--rotate-control_dark')).toBe(true);

        map.update({theme: 'light'});
        expect(element?.classList.contains('ymaps3--rotate-control_dark')).toBe(false);
    });
});
