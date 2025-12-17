import {LOCATION, VIDEO_BOUNDS, VIDEO_URL, VIDEO_ATTRIBUTES, ZOOM_RANGE} from '../variables.js';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = vuefy.module(ymaps3);

    const {YMapVideoOverlay} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapVideoOverlay
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };

            return {LOCATION, refMap, VIDEO_BOUNDS, VIDEO_URL, VIDEO_ATTRIBUTES, ZOOM_RANGE};
        },
        template: `
            <YMap :location="LOCATION" :showScaleInCopyrights="true" :zoomRange="ZOOM_RANGE" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />

                <YMapVideoOverlay
                    :bounds="VIDEO_BOUNDS"
                    :videoUrl="VIDEO_URL"
                    :videoAttributes="VIDEO_ATTRIBUTES"
                    className="video-overlay"
                />
            </YMap>`
    });
    app.mount('#app');
}
