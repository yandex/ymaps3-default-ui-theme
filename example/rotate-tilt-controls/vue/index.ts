import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);
    const {YMap, YMapControls, YMapDefaultSchemeLayer} = vuefy.module(ymaps3);
    const {YMapRotateTiltControl, YMapTiltControl, YMapRotateControl, YMapZoomControl} = vuefy.module(
        await ymaps3.import('@yandex/ymaps3-default-ui-theme')
    );
    const app = Vue.createApp({
        components: {
            YMap,
            YMapControls,
            YMapDefaultSchemeLayer,
            YMapRotateTiltControl,
            YMapTiltControl,
            YMapRotateControl,
            YMapZoomControl
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            return {LOCATION, ENABLED_BEHAVIORS, refMap};
        },
        template: `
            <YMap :location="LOCATION" :behaviors="ENABLED_BEHAVIORS" :showScaleInCopyrights="true" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapControls position="right">
                    <YMapRotateTiltControl />
                    <YMapRotateControl />
                    <YMapTiltControl />
                </YMapControls>
            </YMap>`
    });
    app.mount('#app');
}
