import {LOCATION, IMAGE_BOUNDS, IMAGE_RELATIVE_PATH} from '../variables';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = vuefy.module(ymaps3);

    const {YMapImageOverlay} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapImageOverlay
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };

            return {LOCATION, refMap, IMAGE_BOUNDS, IMAGE_RELATIVE_PATH};
        },
        template: `
            <YMap :location="LOCATION" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />

                <YMapImageOverlay :bounds="IMAGE_BOUNDS" :image="IMAGE_RELATIVE_PATH" className="image-overlay" />
            </YMap>`
    });
    app.mount('#app');
}
