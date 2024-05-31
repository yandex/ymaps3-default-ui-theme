import type {Feature, SearchResponse} from '@yandex/ymaps3-types';
import {LOCATION, MARGIN, initialMarkerProps, findSearchResultBoundsRange} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {createApp, ref} = Vue;

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = vuefy.module(ymaps3);

    const {YMapDefaultMarker} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));
    const {YMapSearchControl} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
            YMapDefaultMarker,
            YMapSearchControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };

            const location = ref(LOCATION);

            const searchMarkersProps = ref([initialMarkerProps]);

            const updateMapLocation = (searchResult: SearchResponse) => {
                if (searchResult.length !== 0) {
                    let center;
                    let zoom;
                    let bounds;

                    if (searchResult.length === 1) {
                        center = searchResult[0].geometry?.coordinates;
                        zoom = 12;
                    } else {
                        bounds = findSearchResultBoundsRange(searchResult);
                    }

                    location.value = {
                        center,
                        zoom,
                        bounds,
                        duration: 400
                    };
                }
            };

            const searchResultHandler = (searchResult: SearchResponse) => {
                searchMarkersProps.value = searchResult;
                updateMapLocation(searchResult);
            };

            const onClickSearchMarkerHandler = (clickedMarker: Feature) => {
                searchMarkersProps.value = searchMarkersProps.value.filter((marker) => marker !== clickedMarker);
            };

            return {location, MARGIN, refMap, searchResultHandler, searchMarkersProps, onClickSearchMarkerHandler};
        },
        template: `
            <YMap :location="location" :margin="MARGIN" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top">
                    <YMapSearchControl :searchResult="searchResultHandler" />
                </YMapControls>

                <YMapDefaultMarker
                    v-for="marker in searchMarkersProps"
                    :key="marker.geometry.coordinates"
                    :title="marker.properties.name"
                    :subtitle="marker.properties.description"
                    :coordinates="marker.geometry.coordinates"
                    :onClick="()=>onClickSearchMarkerHandler(marker)"
                    size="normal"
                    iconName="fallback"
                />
            </YMap>`
    });
    app.mount('#app');
}
