import type {LngLat, LngLatBounds, YMapLocationRequest} from '@yandex/ymaps3-types';

const BOUNDS: LngLatBounds = [
    [36.76, 56.5],
    [38.48, 54.98]
];
export const CENTER: LngLat = [37.617563, 55.755841];

export const LOCATION: YMapLocationRequest = {bounds: BOUNDS};
