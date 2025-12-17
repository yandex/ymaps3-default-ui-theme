import type {YMapLocationRequest, LngLatBounds, ZoomRange} from '@yandex/ymaps3-types';

export const LOCATION: YMapLocationRequest = {
    center: [37.6215, 55.7355], // starting position [lng, lat]
    zoom: 9 // starting zoom
};

export const ZOOM_RANGE: ZoomRange = {
    min: 8,
    max: 11
};

export const OVERLAY_BOUNDS: LngLatBounds = [
    [37.293, 55.555],
    [37.95, 55.92]
];

export const IFRAME_CLASSNAME = 'iframe-overlay';
export const IFRAME_URL = 'https://doka.guide/html/iframe/';

export const IFRAME_ATTRIBUTES = {
    className: IFRAME_CLASSNAME,
    src: IFRAME_URL,
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowFullscreen: true
};
