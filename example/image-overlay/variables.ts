import type {YMapLocationRequest, LngLatBounds} from '@yandex/ymaps3-types';

export const LOCATION: YMapLocationRequest = {
    center: [37.625, 55.755], // starting position [lng, lat]
    zoom: 13 // starting zoom
};

export const IMAGE_BOUNDS: LngLatBounds = [
    [37.605, 55.745],
    [37.645, 55.765]
];

export const IMAGE_RELATIVE_PATH: string = '../msc.jpg';
