import {LngLatBounds, YMap} from '@yandex/ymaps3-types';
import {createContainer, CENTER} from '../../tests/common';
import {boundsToCornerPoints, boundsToWidthHeight} from './common';

describe('overlays/common', () => {
    describe('boundsToCornerPoints', () => {
        it('should return all three corner points from bounds', () => {
            const bounds: LngLatBounds = [
                [30, 50],
                [40, 60]
            ];

            const result = boundsToCornerPoints(bounds);

            expect(result).toEqual({
                leftUpperCorner: [30, 60],
                leftLowerCorner: [30, 50],
                rightUpperCorner: [40, 60]
            });
        });

        it('should work correctly with negative coordinates', () => {
            const bounds: LngLatBounds = [
                [-10, -20],
                [10, 20]
            ];

            const result = boundsToCornerPoints(bounds);

            expect(result).toEqual({
                leftUpperCorner: [-10, 20],
                leftLowerCorner: [-10, -20],
                rightUpperCorner: [10, 20]
            });
        });

        it('should work with zero coordinates', () => {
            const bounds: LngLatBounds = [
                [0, 0],
                [10, 10]
            ];

            const result = boundsToCornerPoints(bounds);

            expect(result).toEqual({
                leftUpperCorner: [0, 10],
                leftLowerCorner: [0, 0],
                rightUpperCorner: [10, 10]
            });
        });

        it('should work when both points are the same', () => {
            const bounds: LngLatBounds = [
                [30, 50],
                [30, 50]
            ];

            const result = boundsToCornerPoints(bounds);

            expect(result).toEqual({
                leftUpperCorner: [30, 50],
                leftLowerCorner: [30, 50],
                rightUpperCorner: [30, 50]
            });
        });
    });

    describe('boundsToWidthHeight', () => {
        let map: YMap;
        let container: HTMLElement;

        beforeEach(() => {
            container = createContainer();
            document.body.append(container);
            map = new ymaps3.YMap(container, {location: {center: CENTER, zoom: 10}});
        });

        afterEach(() => {
            map.destroy();
        });

        it('should calculate width and height for given bounds', () => {
            const bounds: LngLatBounds = [
                [30, 50],
                [40, 60]
            ];

            const result = boundsToWidthHeight(map, bounds);

            expect(result.width).toBeCloseTo(7281.78, 1);
            expect(result.height).toBeCloseTo(12750.19, 1);
        });

        it('should work with negative coordinates', () => {
            const bounds: LngLatBounds = [
                [-10, -20],
                [10, 20]
            ];

            const result = boundsToWidthHeight(map, bounds);

            expect(result.width).toBeCloseTo(14563.56, 1);
            expect(result.height).toBeCloseTo(29546.2, 1);
        });

        it('should work with zero coordinates', () => {
            const bounds: LngLatBounds = [
                [0, 0],
                [10, 10]
            ];

            const result = boundsToWidthHeight(map, bounds);

            expect(result.width).toBeCloseTo(7281.78, 1);
            expect(result.height).toBeCloseTo(7270.53, 1);
        });

        it('should work correctly with different zoom levels', () => {
            const bounds: LngLatBounds = [
                [0, 0],
                [10, 10]
            ];

            map.setLocation({center: CENTER, zoom: 5});
            const result1 = boundsToWidthHeight(map, bounds);

            map.setLocation({center: CENTER, zoom: 15});
            const result2 = boundsToWidthHeight(map, bounds);

            expect(result2.width).toBeGreaterThan(result1.width);
            expect(result2.height).toBeGreaterThan(result1.height);
        });

        it('should return zero width and height when both points are the same', () => {
            const bounds: LngLatBounds = [
                [30, 50],
                [30, 50]
            ];

            const result = boundsToWidthHeight(map, bounds);

            expect(result.width).toBe(0);
            expect(result.height).toBe(0);
        });
    });
});
