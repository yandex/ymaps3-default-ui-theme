import {YMapTheme} from '@yandex/ymaps3-types';
import {LOCATION, MARKER_LOCATIONS} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} =
        vuefy.module(ymaps3);

    const {YMapDefaultMarker} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapDefaultMarker,
            YMapControls,
            YMapControlButton
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const theme = Vue.ref<YMapTheme>('light');

            const switchTheme = () => {
                theme.value = theme.value === 'light' ? 'dark' : 'light';
            };
            return {LOCATION, refMap, MARKER_LOCATIONS, theme, switchTheme};
        },
        template: `
            <YMap :location="LOCATION" :theme="theme" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top right">
                    <YMapControlButton text="Switch theme" :onClick="switchTheme" />
                </YMapControls>
                <YMapDefaultMarker v-for="(props, i) in MARKER_LOCATIONS" v-bind="props" :key="i" />
            </YMap>`
    });
    app.mount('#app');
}
