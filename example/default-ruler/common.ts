import type {LngLat, YMapLocationRequest} from '@yandex/ymaps3-types';

export const LOCATION: YMapLocationRequest = {
    center: [31.245384, 30.051434], // starting position [lng, lat]
    zoom: 3 // starting zoom
};

export const RULER_COORDINATES: LngLat[] = [
    [-0.128407, 51.506807], // London
    [31.245384, 30.051434], // Cairo
    [77.201224, 28.614653] // New Delhi
];
