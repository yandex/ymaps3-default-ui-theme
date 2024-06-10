import {CENTER, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = vuefy.module(ymaps3);

    const {YMapDefaultMarker, YMapZoomControl} = vuefy.module(
        await ymaps3.import('@yandex/ymaps3-default-ui-theme')
    );

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
            YMapDefaultMarker,
            YMapZoomControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            return {LOCATION, CENTER, refMap};
        },
        template: `
            <YMap :location="LOCATION" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="right">
                    <YMapZoomControl />
                </YMapControls>
                <YMapDefaultMarker :coordinates="CENTER" size="normal" iconName="fallback" />
            </YMap>`
    });
    app.mount('#app');
}
