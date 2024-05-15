import {MarkerSizeProps} from '../../src';
import {CENTER, LOCATION} from '../common';

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
            YMapControls,
            YMapControlButton,
            YMapDefaultMarker
        },
        setup() {
            const size = Vue.ref<MarkerSizeProps>('normal');
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const setNormalSize = () => (size.value = 'normal');
            const setSmallSize = () => (size.value = 'small');
            const setMicroSize = () => (size.value = 'micro');

            return {LOCATION, CENTER, size, refMap, setNormalSize, setSmallSize, setMicroSize};
        },
        template: `
            <YMap :location="LOCATION" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapDefaultMarker :coordinates="CENTER" iconName="fallback" :size="size">
                    <template #popupContent>
                        <span>Marker popup</span>
                    </template>
                </YMapDefaultMarker>
                <YMapControls position="top left">
                    <YMapControlButton text="Normal" :onClick="setNormalSize" />
                    <YMapControlButton text="Small" :onClick="setSmallSize" />
                    <YMapControlButton text="Micro" :onClick="setMicroSize" />
                </YMapControls>
            </YMap>`
    });
    app.mount('#app');
}
