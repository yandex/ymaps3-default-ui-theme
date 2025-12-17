import type {YMapLocationRequest, LngLatBounds, VideoAttributes, ZoomRange} from '@yandex/ymaps3-types';

export const LOCATION: YMapLocationRequest = {
    center: [37.6215, 55.7355], // starting position [lng, lat]
    zoom: 9 // starting zoom
};

export const ZOOM_RANGE: ZoomRange = {
    min: 8,
    max: 11
};

export const VIDEO_BOUNDS: LngLatBounds = [
    [37.293, 55.555],
    [37.95, 55.92]
];

export const VIDEO_ATTRIBUTES: VideoAttributes = {
    autoplay: true,
    loop: true,
    muted: true,
    controls: true,
    playsInline: true
};
// Example video URL (you can replace with your own video file or URL)
export const VIDEO_URL: string = 'https://yastatic.net/s3/milab/2020/drive/heatmap-video/assets/2x.mp4';
