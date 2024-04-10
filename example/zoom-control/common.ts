import type {YMapLocationRequest, LngLatBounds} from '@yandex/ymaps3-types';

const BOUNDS: LngLatBounds = [
    [36.76, 56.5],
    [38.48, 54.98]
];

export const LOCATION: YMapLocationRequest = {bounds: BOUNDS};
