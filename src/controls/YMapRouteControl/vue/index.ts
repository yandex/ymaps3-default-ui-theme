import {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import {TruckParameters} from '@yandex/ymaps3-types/imperative/route';
import {LngLat} from '@yandex/ymaps3-types';
import {YMapRouteControl, YMapRouteControlProps, AvailableTypes} from '..';
import type TVue from '@vue/runtime-core';

export const YMapRouteControlVuefyOptions: CustomVuefyOptions<YMapRouteControl> = {
    props: {
        geolocationTextInput: String,
        clearFieldsText: String,
        changeOrderText: String,
        availableTypes: Array as TVue.PropType<AvailableTypes[]>,
        truckParameters: Object as TVue.PropType<TruckParameters>,
        waypoints: Array as unknown as TVue.PropType<[LngLat | null, LngLat | null]>,
        waypointsPlaceholders: Array as unknown as TVue.PropType<[string, string]>,
        search: Function as TVue.PropType<YMapRouteControlProps['search']>,
        suggest: Function as TVue.PropType<YMapRouteControlProps['suggest']>,
        route: Function as TVue.PropType<YMapRouteControlProps['route']>,
        onMouseMoveOnMap: Function as TVue.PropType<YMapRouteControlProps['onMouseMoveOnMap']>,
        onUpdateWaypoints: Function as TVue.PropType<YMapRouteControlProps['onUpdateWaypoints']>,
        onRouteResult: Function as TVue.PropType<YMapRouteControlProps['onRouteResult']>,
        onBuildRouteError: Function as TVue.PropType<YMapRouteControlProps['onBuildRouteError']>
    }
};
