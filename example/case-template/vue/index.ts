import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = vuefy.module(ymaps3);

    const {YMapZoomControl} = vuefy.module(await ymaps3.import('@yandex/ymaps3-controls@0.0.1'));

    const {YMapButtonExample} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
            YMapZoomControl,
            YMapButtonExample
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const onClick = () => alert('Click!');
            return {LOCATION, refMap, onClick};
        },
        template: `
            <YMap :location="LOCATION" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="right">
                    <YMapZoomControl />
                    <YMapButtonExample text="My button" :onClick="onClick" />
                </YMapControls>
            </YMap>`
    });
    app.mount('#app');
}
