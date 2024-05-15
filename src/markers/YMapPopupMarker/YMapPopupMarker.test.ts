import {YMap} from '@yandex/ymaps3-types';
import {createContainer, CENTER} from '../../../tests/common';
import {YMapPopupMarker} from './';

describe('YMapPopupMarker', () => {
    let map: YMap;
    let container: HTMLElement;

    beforeEach(() => {
        container = createContainer();
        document.body.append(container);
        map = new ymaps3.YMap(container, {location: {center: CENTER, zoom: 0}});
        map.addChild(new ymaps3.YMapDefaultFeaturesLayer({}));
    });

    afterEach(() => {
        map.destroy();
    });

    it('add on map', () => {
        const popup = new YMapPopupMarker({coordinates: CENTER, content: createPopupContent});
        map.addChild(popup);

        expect(document.querySelector('.ymaps3--popup-marker')).not.toBeNull();
        expect(document.querySelector('.ymaps3--popup-marker .test-popup')).not.toBeNull();
    });
    it('add on map with text', () => {
        const popup = new YMapPopupMarker({coordinates: CENTER, content: 'test popup'});
        map.addChild(popup);

        expect(document.querySelector('.ymaps3--popup-marker')).not.toBeNull();
        expect(document.querySelector('.ymaps3--popup-marker .ymaps3--popup-marker_container').textContent).toBe(
            'test popup'
        );
    });

    it('changing show props', () => {
        const popup = new YMapPopupMarker({show: true, coordinates: CENTER, content: createPopupContent});
        map.addChild(popup);

        const popupMarkerElement = document.querySelector<HTMLElement>('.ymaps3--popup-marker');
        expect(popupMarkerElement).not.toBeNull();

        expect(popup.isOpen).toBe(true);
        expect(document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__hide')).toBeNull();

        popup.update({show: false});
        expect(popup.isOpen).toBe(false);
        expect(document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__hide')).not.toBeNull();

        popup.update({show: true});
        expect(popup.isOpen).toBe(true);
        expect(document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__hide')).toBeNull();
    });

    it('offset props', () => {
        const popup = new YMapPopupMarker({offset: 12, coordinates: CENTER, content: createPopupContent});
        map.addChild(popup);

        const popupMarkerElement = document.querySelector<HTMLElement>('.ymaps3--popup-marker');
        expect(popupMarkerElement.style.getPropertyValue('--ymaps3-default-offset')).toBe('12px');

        popup.update({offset: 24});
        expect(popupMarkerElement.style.getPropertyValue('--ymaps3-default-offset')).toBe('24px');
    });

    describe('callback for closing and opening', () => {
        it('callback on open', (done) => {
            const onOpen = () => {
                expect(popup.isOpen).toBe(true);
                done();
            };
            const popup = new YMapPopupMarker({
                show: true,
                coordinates: CENTER,
                content: createPopupContent,
                onOpen
            });
            map.addChild(popup);
        });
        it('callback on close', (done) => {
            const onClose = () => {
                expect(popup.isOpen).toBe(false);
                done();
            };
            const popup = new YMapPopupMarker({
                show: true,
                coordinates: CENTER,
                content: createPopupContent,
                onClose
            });
            map.addChild(popup);
            popup.update({show: false});
        });
    });

    describe('change popup position', () => {
        it('initial default position', () => {
            const popup = new YMapPopupMarker({coordinates: CENTER, content: createPopupContent});
            map.addChild(popup);

            expect(
                document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__position-top')
            ).not.toBeNull();
        });
        it('initial position', () => {
            const popup = new YMapPopupMarker({position: 'left', coordinates: CENTER, content: createPopupContent});
            map.addChild(popup);

            expect(
                document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__position-left')
            ).not.toBeNull();
        });
        it('change position props', () => {
            const popup = new YMapPopupMarker({coordinates: CENTER, content: createPopupContent});
            map.addChild(popup);

            popup.update({position: 'top'});
            expect(
                document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__position-top')
            ).not.toBeNull();

            popup.update({position: 'bottom'});
            expect(
                document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__position-bottom')
            ).not.toBeNull();

            popup.update({position: 'left'});
            expect(
                document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__position-left')
            ).not.toBeNull();

            popup.update({position: 'right'});
            expect(
                document.querySelector('.ymaps3--popup-marker.ymaps3--popup-marker__position-right')
            ).not.toBeNull();
        });
        it('change combined position props', () => {
            const popup = new YMapPopupMarker({coordinates: CENTER, content: createPopupContent});
            map.addChild(popup);

            popup.update({position: 'top left'});
            expect(
                document.querySelector(
                    '.ymaps3--popup-marker.ymaps3--popup-marker__position-top.ymaps3--popup-marker__position-left'
                )
            ).not.toBeNull();
            popup.update({position: 'top right'});
            expect(
                document.querySelector(
                    '.ymaps3--popup-marker.ymaps3--popup-marker__position-top.ymaps3--popup-marker__position-right'
                )
            ).not.toBeNull();

            popup.update({position: 'bottom left'});
            expect(
                document.querySelector(
                    '.ymaps3--popup-marker.ymaps3--popup-marker__position-bottom.ymaps3--popup-marker__position-left'
                )
            ).not.toBeNull();
            popup.update({position: 'bottom right'});
            expect(
                document.querySelector(
                    '.ymaps3--popup-marker.ymaps3--popup-marker__position-bottom.ymaps3--popup-marker__position-right'
                )
            ).not.toBeNull();
        });
    });
});

const createPopupContent = () => {
    const popup = document.createElement('div');
    popup.classList.add('test-popup');
    return popup;
};
