import type {LngLat, LngLatBounds, YMapLocationRequest} from '@yandex/ymaps3-types';
import {YMapDefaultMarkerProps} from '../../src';

const BOUNDS: LngLatBounds = [
    [36.76, 56.5],
    [38.48, 54.98]
];

export const LOCATION: YMapLocationRequest = {bounds: BOUNDS};

const CENTER: LngLat = [(BOUNDS[0][0] + BOUNDS[1][0]) / 2, (BOUNDS[0][1] + BOUNDS[1][1]) / 2];
const STEP = 0.3;

const getCoordinates = (row: number, col: number): LngLat => [CENTER[0] + row * STEP, CENTER[1] + col * STEP];

export const MARKER_LOCATIONS: YMapDefaultMarkerProps[] = [
    // default marker
    {coordinates: getCoordinates(-3, 0.5), size: 'normal'},
    {coordinates: getCoordinates(-3, 0), size: 'small'},
    {coordinates: getCoordinates(-3, -0.5), size: 'micro'},
    // fallback color marker
    {coordinates: getCoordinates(-2, 0.5), size: 'normal', color: 'blue',iconName:'fallback'},
    {coordinates: getCoordinates(-2, 0), size: 'small', color: 'blue',iconName:'fallback'},
    {coordinates: getCoordinates(-2, -0.5), size: 'micro', color: 'blue',iconName:'fallback'},
    // color icon marker
    {coordinates: getCoordinates(-1, 0.5), size: 'normal', color: 'tulip', iconName: 'attraction'},
    {coordinates: getCoordinates(-1, 0), size: 'small', color: 'tulip', iconName: 'attraction'},
    {coordinates: getCoordinates(-1, -0.5), size: 'micro', color: 'tulip', iconName: 'attraction'},
    // title hint
    {coordinates: getCoordinates(0, 0.5), size: 'normal', color: 'orange', iconName: 'restaurants',title:'Normal title'},
    {coordinates: getCoordinates(0, 0), size: 'small', color: 'orange', iconName: 'restaurants',title:'Normal title'},
    {coordinates: getCoordinates(0, -0.5), size: 'micro', color: 'orange', iconName: 'restaurants',title:'Normal title'},
    // title subtitle hint
    {coordinates: getCoordinates(1, 0.5), size: 'normal', color: 'green', iconName: 'beach',title:'Normal title',subtitle:'Normal subtitle'},
    {coordinates: getCoordinates(1, 0), size: 'small', color: 'green', iconName: 'beach',title:'Normal title',subtitle:'Normal subtitle'},
    {coordinates: getCoordinates(1, -0.5), size: 'micro', color: 'green', iconName: 'beach',title:'Normal title',subtitle:'Normal subtitle'},
    // hover hint
    {coordinates: getCoordinates(2, 0.5), size: 'normal', color: "pink", iconName: 'medicine',title:'Hover title',subtitle:'Hover subtitle',staticHint:false,},
    {coordinates: getCoordinates(2, 0), size: 'small', color: "pink", iconName: 'medicine',title:'Hover title',subtitle:'Hover subtitle',staticHint:false,},
    {coordinates: getCoordinates(2, -0.5), size: 'micro', color: "pink", iconName: 'medicine',title:'Hover title',subtitle:'Hover subtitle',staticHint:false,},
    // overflow hint
    {coordinates: getCoordinates(3, 0.5), size: 'normal', color: "brightlilac", iconName: 'auto',title:'Overflow title Overflow title',subtitle:'Overflow subtitle Overflow subtitle'},
    {coordinates: getCoordinates(3, 0), size: 'small', color: "brightlilac", iconName: 'auto',title:'Overflow title Overflow title',subtitle:'Overflow subtitle Overflow subtitle'},
    {coordinates: getCoordinates(3, -0.5), size: 'micro', color: "brightlilac", iconName: 'auto',title:'Overflow title Overflow title',subtitle:'Overflow subtitle Overflow subtitle'},
];
