import type {BaseRouteResponse, LngLat, RouteOptions, YMapFeature} from '@yandex/ymaps3-types';
import type {YMapDefaultMarker} from '../../src';
import {
    FROM_POINT_STYLE,
    LOCATION,
    PREVIEW_POINT_STYLE,
    TO_POINT_STYLE,
    TRUCK_PARAMS,
    computeBoundsForPoints,
    getStroke
} from '../common';

window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = ymaps3;

    const {YMapRouteControl, YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(document.getElementById('app'), {location: LOCATION, margin: [20, 20, 20, 20]}, [
        new YMapDefaultSchemeLayer({}),
        new YMapDefaultFeaturesLayer({})
    ]);

    const dragEndHandler = () => {
        routeControl.update({
            waypoints: [
                map.children.includes(fromPoint) ? fromPoint.coordinates : null,
                map.children.includes(toPoint) ? toPoint.coordinates : null
            ]
        });
    };

    const fromPoint: YMapDefaultMarker = new YMapDefaultMarker({
        coordinates: map.center as LngLat,
        onDragEnd: dragEndHandler,
        draggable: true,
        ...FROM_POINT_STYLE
    });
    const toPoint: YMapDefaultMarker = new YMapDefaultMarker({
        coordinates: map.center as LngLat,
        onDragEnd: dragEndHandler,
        draggable: true,
        ...TO_POINT_STYLE
    });
    let previewPoint: YMapDefaultMarker = new YMapDefaultMarker({
        coordinates: map.center as LngLat,
        ...PREVIEW_POINT_STYLE
    });

    let featuresOnMap: YMapFeature[] = [];

    const routeControl = new YMapRouteControl({
        truckParameters: TRUCK_PARAMS,
        waypoints: [map.center as LngLat, null],
        onBuildRouteError() {
            featuresOnMap.forEach((f) => map.removeChild(f));
            featuresOnMap = [];
        },
        onRouteResult(result, type) {
            featuresOnMap.forEach((f) => map.removeChild(f));
            featuresOnMap = getFeatures(result, type);
            featuresOnMap.forEach((f) => map.addChild(f));

            const bounds = computeBoundsForPoints(result.toRoute().geometry.coordinates);
            map.update({location: {bounds, duration: 500}});
        },
        onUpdateWaypoints(waypoints) {
            const [from, to] = waypoints;
            if (from) {
                const {coordinates} = from.geometry;
                fromPoint.update({coordinates});
                map.addChild(fromPoint);
            } else {
                map.removeChild(fromPoint);
            }

            if (to) {
                const {coordinates} = to.geometry;
                toPoint.update({coordinates});
                map.addChild(toPoint);
            } else {
                map.removeChild(toPoint);
            }
            if (!to || !from) {
                featuresOnMap.forEach((f) => map.removeChild(f));
                featuresOnMap = [];
            }
        },
        onMouseMoveOnMap(coordinates, index, lastCall) {
            if (!lastCall) {
                previewPoint.update({coordinates});

                if (!map.children.includes(previewPoint)) {
                    map.addChild(previewPoint);
                }
            } else {
                map.removeChild(previewPoint);
            }
        }
    });

    map.addChild(new YMapControls({position: 'top left'}).addChild(routeControl));

    const getFeatures = (result: BaseRouteResponse, type: RouteOptions['type']): YMapFeature[] => {
        if (type !== 'transit') {
            const {geometry} = result.toRoute();
            return [new ymaps3.YMapFeature({geometry, style: {stroke: getStroke(type), simplificationRate: 0}})];
        }
        return result.toSteps().map(
            (step) =>
                new ymaps3.YMapFeature({
                    geometry: step.geometry,
                    style: {stroke: getStroke(step.properties.mode as RouteOptions['type']), simplificationRate: 0}
                })
        );
    };
}
