import type {YMapLocationRequest, LngLatBounds} from '@yandex/ymaps3-types';

// export const LOCATION: YMapLocationRequest = {
//     center: [37.35, 55.75], // starting position [lng, lat]
//     zoom: 12 // starting zoom
// };
export const LOCATION: YMapLocationRequest = {
    center: [37.625, 55.755], // starting position [lng, lat]
    zoom: 13 // starting zoom
};

export const RECTANGLE_COORDINATES: LngLatBounds = [
    [37.605, 55.745],
    [37.645, 55.765]
];
// export const RECTANGLE_COORDINATES_2: LngLatBounds = [
//     [37.3, 55.7],
//     [37.4, 55.8]
// ];

export const IMAGE_RELATIVE_PATH: string = '../msc.jpg'; // картинка из браузера
// export const IMAGE_RELATIVE_PATH_2: string = '../map.svg'; // скрин нашей карты
