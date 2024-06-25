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
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapFeature} = vuefy.module(ymaps3);

    const {YMapRouteControl, YMapDefaultMarker} = vuefy.module(
        await ymaps3.import('@yandex/ymaps3-default-ui-theme')
    );

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
            YMapFeature,
            YMapRouteControl,
            YMapDefaultMarker
        },
        setup() {
            const location = Vue.ref<YMapLocationRequest>(LOCATION);
            const routeType = Vue.ref<RouteOptions['type']>('driving');
            const routeResult = Vue.shallowRef<BaseRouteResponse>();
            const showFeature = Vue.ref(false);
            const fromCoords = Vue.ref<LngLat | undefined>();
            const toCoords = Vue.ref<LngLat | undefined>();
            const previewCoords = Vue.ref<LngLat | undefined>();

            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const onRouteResult = (result: BaseRouteResponse, type: RouteOptions['type']) => {
                routeType.value = type;
                routeResult.value = result;
                showFeature.value = true;
                const bounds = computeBoundsForPoints(result.toRoute().geometry.coordinates);
                location.value = {bounds, duration: 500};
            };
            const onUpdateWaypoints = (waypoints: WaypointsArray) => {
                const [from, to] = waypoints;
                fromCoords.value = from?.geometry?.coordinates;
                toCoords.value = to?.geometry?.coordinates;

                if (!from && !to) {
                    showFeature.value = false;
                }
                previewCoords.value = undefined;
            };
            const onBuildRouteError = () => {
                showFeature.value = false;
            };
            const onMouseMoveOnMap: YMapRouteControlProps['onMouseMoveOnMap'] = (coordinates, index, lastCall) => {
                previewCoords.value = lastCall ? undefined : coordinates;
            };
            const features = Vue.computed(() => {
                if (!routeResult) {
                    return null;
                }
                if (routeType.value !== 'transit') {
                    const {geometry} = routeResult.value.toRoute();
                    return [
                        {
                            geometry,
                            style: {stroke: getStroke(routeType.value), simplificationRate: 0}
                        }
                    ];
                }
                return routeResult.value.toSteps().map((step) => ({
                    geometry: step.geometry,
                    style: {
                        stroke: getStroke(step.properties.mode as RouteOptions['type']),
                        simplificationRate: 0
                    }
                }));
            });

            return {
                LOCATION,
                MARGIN,
                FROM_POINT_STYLE,
                PREVIEW_POINT_STYLE,
                TO_POINT_STYLE,
                TRUCK_PARAMS,
                location,
                routeType,
                routeResult,
                showFeature,
                fromCoords,
                toCoords,
                previewCoords,
                features,
                onRouteResult,
                onUpdateWaypoints,
                onBuildRouteError,
                onMouseMoveOnMap,
                refMap
            };
        },
        template: `
            <YMap :location="location" :margin="MARGIN" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top left">
                    <YMapRouteControl 
                        :truckParameters="TRUCK_PARAMS"
                        :waypoints="[LOCATION.center, null]"
                        :onRouteResult="onRouteResult"
                        :onUpdateWaypoints="onUpdateWaypoints"
                        :onBuildRouteError="onBuildRouteError"
                        :onMouseMoveOnMap="onMouseMoveOnMap" />
                </YMapControls>
                <template v-if="showFeature">
                    <YMapFeature v-for="feature in features"
                        :geometry="feature.geometry"
                        :style="feature.style" />
                </template>
                <YMapDefaultMarker 
                    v-if="fromCoords !== undefined"
                    :coordinates="fromCoords" v-bind="FROM_POINT_STYLE" />
                <YMapDefaultMarker 
                    v-if="toCoords !== undefined"
                    :coordinates="toCoords" v-bind="TO_POINT_STYLE" />
                <YMapDefaultMarker 
                    v-if="previewCoords !== undefined"
                    :coordinates="previewCoords" v-bind="PREVIEW_POINT_STYLE" />
                
            </YMap>`
    });
    app.mount('#app');
}
