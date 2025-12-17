import {LOCATION, OVERLAY_BOUNDS, ZOOM_RANGE, IFRAME_ATTRIBUTES} from '../variables.js';

window.map = null;

main();

async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = vuefy.module(ymaps3);
    const {YMapOverlay} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapOverlay
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };

            return {LOCATION, refMap, OVERLAY_BOUNDS, ZOOM_RANGE, IFRAME_ATTRIBUTES};
        },
        template: `
            <YMap :location="LOCATION" :showScaleInCopyrights="true" :zoomRange="ZOOM_RANGE" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapOverlay :bounds="OVERLAY_BOUNDS">
                    <iframe v-bind="IFRAME_ATTRIBUTES" />
                </YMapOverlay>
            </YMap>`
    });
    app.mount('#app');
}
