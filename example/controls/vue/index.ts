import {YMapTheme} from '@yandex/ymaps3-types';
import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} =
        vuefy.module(ymaps3);

    const {YMapGeolocationControl, YMapRotateControl, YMapRotateTiltControl, YMapTiltControl, YMapZoomControl} =
        vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
            YMapControlButton,
            YMapGeolocationControl,
            YMapRotateControl,
            YMapRotateTiltControl,
            YMapTiltControl,
            YMapZoomControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const theme = Vue.ref<YMapTheme>('dark');

            const switchTheme = () => {
                theme.value = theme.value === 'light' ? 'dark' : 'light';
            };
            return {LOCATION, ENABLED_BEHAVIORS, refMap, theme, switchTheme};
        },
        template: `
            <YMap :location="LOCATION" :behaviors="ENABLED_BEHAVIORS" :theme="theme" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top right">
                    <YMapControlButton text="Switch theme" :onClick="switchTheme" />
                </YMapControls>
                <YMapControls position="left">
                    <YMapZoomControl />
                    <YMapGeolocationControl :zoom="11" />
                </YMapControls>
                <YMapControls position="bottom">
                    <YMapZoomControl />
                </YMapControls>
                <YMapControls position="right">
                    <YMapRotateTiltControl />
                    <YMapRotateControl />
                    <YMapTiltControl />
                </YMapControls>
            </YMap>`
    });
    app.mount('#app');
}
