import {Position, degToRad, getDeltaAzimuth, radToDeg, toggleRotate, toggleTilt} from './angle-utils';

describe('angle-utils functions', () => {
    describe('toggleTilt', () => {
        const MAX_TILT = 45;
        const MIN_TILT = 0;

        it('min tilt', () => {
            expect(toggleTilt(MIN_TILT, MIN_TILT, MAX_TILT)).toBe(MAX_TILT);
        });
        it('max tilt', () => {
            expect(toggleTilt(MAX_TILT, MIN_TILT, MAX_TILT)).toBe(MIN_TILT);
        });
        it('mid tilt', () => {
            expect(toggleTilt(15, MIN_TILT, MAX_TILT)).toBe(MIN_TILT);
        });
    });
    describe('toggleRotate', () => {
        it('0 deg', () => {
            expect(toggleRotate(0)).toBeCloseTo(-Math.PI / 4);
        });
        it('> Pi', () => {
            expect(toggleRotate(Math.PI * 1.5)).toBeCloseTo(Math.PI * 2);
        });
        it('< Pi', () => {
            expect(toggleRotate(Math.PI * 0.5)).toBeCloseTo(0);
        });
    });
    describe('radToDeg', () => {
        it('0 rad to deg', () => {
            expect(radToDeg(0)).toBeCloseTo(0);
        });
        it('Pi rad to deg', () => {
            expect(radToDeg(Math.PI)).toBeCloseTo(180);
        });
        it('2Pi rad to deg', () => {
            expect(radToDeg(Math.PI * 2)).toBeCloseTo(360);
        });
        it('Pi/2 rad to deg', () => {
            expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
        });
    });
    describe('degToRad', () => {
        it('0 deg to rad', () => {
            expect(degToRad(0)).toBeCloseTo(0);
        });
        it('180 deg to rad', () => {
            expect(degToRad(180)).toBeCloseTo(Math.PI);
        });
        it('360 deg to rad', () => {
            expect(degToRad(360)).toBeCloseTo(Math.PI * 2);
        });
        it('90 deg to rad', () => {
            expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
        });
    });
    describe('getDeltaAzimuth', () => {
        const startPosition: Position = {x: 0, y: 1};
        const controlPosition: Position = {x: 0, y: 0};
        it('rotate to -90 deg', () => {
            const eventPagePosition: Position = {x: -1, y: 0};
            expect(getDeltaAzimuth(startPosition, controlPosition, eventPagePosition)).toBeCloseTo(Math.PI / 2);
        });
        it('rotate to 90 deg', () => {
            const eventPagePosition: Position = {x: 1, y: 0};
            expect(getDeltaAzimuth(startPosition, controlPosition, eventPagePosition)).toBeCloseTo(-Math.PI / 2);
        });
    });
});
