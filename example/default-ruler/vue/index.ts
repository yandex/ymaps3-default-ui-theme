import {RulerType} from '@yandex/ymaps3-types/modules/ruler';
import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

async function main() {
    // For each object in the JS API, there is a Vue counterpart
    // To use the Vue version of the API, include the module @yandex/ymaps3-vuefy
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);
    const {YMap, YMapDefaultSchemeLayer, YMapControls, YMapControlButton} = vuefy.module(ymaps3);
    const {YMapDefaultRuler} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {YMap, YMapDefaultSchemeLayer, YMapControls, YMapControlButton, YMapDefaultRuler},
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            const editable = Vue.ref(true);
            const rulerType = Vue.ref<RulerType>('ruler');

            const switchEditable = () => {
                editable.value = !editable.value;
            };
            const switchType = () => {
                rulerType.value = rulerType.value === 'ruler' ? 'planimeter' : 'ruler';
            };

            const onFinish = () => {
                editable.value = false;
            };
            return {LOCATION, RULER_COORDINATES, refMap, editable, rulerType, switchEditable, switchType, onFinish};
        },
        template: `
            <YMap :location="LOCATION" :showScaleInCopyrights="true" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultRuler :type="rulerType" :points="RULER_COORDINATES" :editable="editable" :onFinish="onFinish" />
                <YMapControls position="top right">
                    <YMapControlButton @click="switchEditable" text="Switch edit ruler" />
                </YMapControls>
                <YMapControls position="top left">
                    <YMapControlButton @click="switchType" text="Switch ruler type" />
                </YMapControls>
            </YMap>`
    });
    app.mount('#app');
}
main();
