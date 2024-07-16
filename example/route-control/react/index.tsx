import {BaseRouteResponse, LngLat, YMapLocationRequest, RouteOptions} from '@yandex/ymaps3-types';
import {YMapRouteControlProps, WaypointsArray} from '../../src';
import {
    FROM_POINT_STYLE,
    LOCATION,
    MARGIN,
    PREVIEW_POINT_STYLE,
    TO_POINT_STYLE,
    TRUCK_PARAMS,
    computeBoundsForPoints,
    getStroke
} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapFeature} = reactify.module(ymaps3);
    const {YMapRouteControl, YMapDefaultMarker} = reactify.module(
        await ymaps3.import('@yandex/ymaps3-default-ui-theme')
    );

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location, setLocation] = React.useState<YMapLocationRequest>(LOCATION);
        const [routeType, setRouteType] = React.useState<RouteOptions['type']>('driving');
        const [routeResult, setRouteResult] = React.useState<BaseRouteResponse>();
        const [showFeature, setShowFeature] = React.useState(false);
        const [fromCoords, setFromCoords] = React.useState<LngLat | undefined>();
        const [toCoords, setToCoords] = React.useState<LngLat | undefined>();
        const [previewCoords, setPreviewCoords] = React.useState<LngLat | undefined>();
        const [waypoints, setWaypoints] = React.useState<[LngLat, LngLat]>([LOCATION.center, null]);

        const onRouteResult = React.useCallback((result: BaseRouteResponse, type: RouteOptions['type']) => {
            setRouteType(type);
            setRouteResult(result);
            setShowFeature(true);
            const bounds = computeBoundsForPoints(result.toRoute().geometry.coordinates);
            setLocation({bounds, duration: 500});
        }, []);

        const onUpdateWaypoints = React.useCallback((waypoints: WaypointsArray) => {
            const [from, to] = waypoints;
            setFromCoords(from?.geometry?.coordinates);
            setToCoords(to?.geometry?.coordinates);

            if (!from || !to) {
                setShowFeature(false);
            }
            setPreviewCoords(undefined);
        }, []);

        const onBuildRouteError = React.useCallback(() => {
            setShowFeature(false);
        }, []);

        const onMouseMoveOnMap = React.useCallback<YMapRouteControlProps['onMouseMoveOnMap']>(
            (coordinates, index, lastCall) => {
                setPreviewCoords(() => (lastCall ? undefined : coordinates));
            },
            []
        );

        const onDragEndHandler = React.useCallback(
            (coordinates: LngLat, type: 'from' | 'to') => {
                if (type === 'from') {
                    setFromCoords(coordinates);
                    setWaypoints([coordinates, toCoords]);
                } else {
                    setToCoords(coordinates);
                    setWaypoints([fromCoords, coordinates]);
                }
            },
            [fromCoords, toCoords]
        );

        const features = React.useMemo(() => {
            if (!routeResult) {
                return null;
            }
            if (routeType !== 'transit') {
                const {geometry} = routeResult.toRoute();
                return [
                    <YMapFeature geometry={geometry} style={{stroke: getStroke(routeType), simplificationRate: 0}} />
                ];
            }
            return routeResult
                .toSteps()
                .map((step) => (
                    <YMapFeature
                        geometry={step.geometry}
                        style={{stroke: getStroke(step.properties.mode as RouteOptions['type']), simplificationRate: 0}}
                    />
                ));
        }, [routeResult, routeType]);

        return (
            <YMap location={location} margin={MARGIN} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top left">
                    <YMapRouteControl
                        truckParameters={TRUCK_PARAMS}
                        waypoints={waypoints}
                        onRouteResult={onRouteResult}
                        onUpdateWaypoints={onUpdateWaypoints}
                        onBuildRouteError={onBuildRouteError}
                        onMouseMoveOnMap={onMouseMoveOnMap}
                    />
                </YMapControls>

                {showFeature && features}
                {fromCoords !== undefined && (
                    <YMapDefaultMarker
                        coordinates={fromCoords}
                        draggable
                        onDragEnd={(coordinates) => onDragEndHandler(coordinates, 'from')}
                        {...FROM_POINT_STYLE}
                    />
                )}
                {toCoords !== undefined && (
                    <YMapDefaultMarker
                        coordinates={toCoords}
                        draggable
                        onDragEnd={(coordinates) => onDragEndHandler(coordinates, 'to')}
                        {...TO_POINT_STYLE}
                    />
                )}
                {previewCoords !== undefined && (
                    <YMapDefaultMarker coordinates={previewCoords} {...PREVIEW_POINT_STYLE} />
                )}
            </YMap>
        );
    }
}
