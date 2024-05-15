import type {YMapLocationRequest, LngLat} from '@yandex/ymaps3-types';

export const CENTER: LngLat = [55.442795, 25.24107];
export const LOCATION: YMapLocationRequest = {center: CENTER, zoom: 14};

export const POPUP_TEXT = 'Default text popup';
export const CUSTOM_POPUP_COORDS: LngLat = [CENTER[0] - 0.02, CENTER[1]];
export const TEXT_POPUP_COORDS: LngLat = [CENTER[0] + 0.02, CENTER[1]];

export const TITLE = 'Default popup marker';
export const DESCRIPTION = 'Description for default popup';
export const ACTION = 'Make an action';
