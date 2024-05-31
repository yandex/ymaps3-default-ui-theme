import type {YMapLocationRequest, LngLatBounds, SearchResponse, Margin, Feature} from '@yandex/ymaps3-types';

const BOUNDS: LngLatBounds = [
    [36.76, 56.5],
    [38.48, 54.98]
];
export const LOCATION: YMapLocationRequest = {bounds: BOUNDS};
export const MARGIN: Margin = [30, 30, 30, 30];

export const initialMarkerProps = {
    properties: {
        name: 'Moscow',
        description: 'Russian Federation'
    },
    geometry: {
        type: 'Point',
        coordinates: [37.617698, 55.755864]
    }
} as Feature;

export const findSearchResultBoundsRange = (searchResult: SearchResponse) => {
    let minLng: number | null = null;
    let maxLng: number | null = null;
    let minLat: number | null = null;
    let maxLat: number | null = null;

    searchResult.forEach((searchResultElement) => {
        const [lng, lat] = searchResultElement.geometry.coordinates;

        if (lng < minLng || minLng === null) {
            minLng = lng;
        }

        if (lng > maxLng || maxLng === null) {
            maxLng = lng;
        }

        if (lat < minLat || minLat === null) {
            minLat = lat;
        }

        if (lat > maxLat || maxLat === null) {
            maxLat = lat;
        }
    });

    return [
        [minLng, maxLat],
        [maxLng, minLat]
    ] as LngLatBounds;
};
