import type {YMapLocationRequest, LngLatBounds, BehaviorType} from '@yandex/ymaps3-types';

const BOUNDS: LngLatBounds = [
    [36.76, 56.5],
    [38.48, 54.98]
];

export const LOCATION: YMapLocationRequest = {bounds: BOUNDS};
export const ENABLED_BEHAVIORS: BehaviorType[] = ['drag', 'scrollZoom', 'dblClick', 'mouseTilt', 'mouseRotate'];
