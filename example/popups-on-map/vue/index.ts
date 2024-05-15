import type {YMapPopupPositionProps} from '../../src';
import {ACTION, CUSTOM_POPUP_COORDS, DESCRIPTION, LOCATION, POPUP_TEXT, TEXT_POPUP_COORDS, TITLE} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} =
        vuefy.module(ymaps3);

    const {YMapPopupMarker} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapControls,
            YMapControlButton,
            YMapPopupMarker
        },
        setup() {
            const refMap = (ref: any) => {
                window.map = ref?.entity;
            };
            const position = Vue.ref<YMapPopupPositionProps>(undefined);
            const showCustom = Vue.ref(true);

            const positionLeft = () => (position.value = 'left');
            const positionLeftTop = () => (position.value = 'left top');
            const positionLeftBottom = () => (position.value = 'left bottom');
            const positionBottom = () => (position.value = 'bottom');
            const positionTop = () => (position.value = 'top');
            const positionRightTop = () => (position.value = 'right top');
            const positionRightBottom = () => (position.value = 'right bottom');
            const positionRight = () => (position.value = 'right');

            const customPopupAction = () => {
                alert('Click on action button!');
            };

            return {
                ACTION,
                CUSTOM_POPUP_COORDS,
                DESCRIPTION,
                LOCATION,
                POPUP_TEXT,
                TEXT_POPUP_COORDS,
                TITLE,
                position,
                showCustom,
                refMap,
                positionLeft,
                positionLeftTop,
                positionLeftBottom,
                positionBottom,
                positionTop,
                positionRightTop,
                positionRightBottom,
                positionRight,
                customPopupAction
            };
        },
        template: `
            <YMap :location="LOCATION" :ref="refMap">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top right">
                    <YMapControlButton text="Left" :onClick="positionLeft" />
                    <YMapControlButton text="Left Top" :onClick="positionLeftTop" />
                    <YMapControlButton text="Left Bottom" :onClick="positionLeftBottom" />
                    <YMapControlButton text="Bottom" :onClick="positionBottom" />
                    <YMapControlButton text="Top" :onClick="positionTop" />
                    <YMapControlButton text="Right Top" :onClick="positionRightTop" />
                    <YMapControlButton text="Right Bottom" :onClick="positionRightBottom" />
                    <YMapControlButton text="Right" :onClick="positionRight" />
                </YMapControls>

                <YMapPopupMarker :coordinates="TEXT_POPUP_COORDS" :draggable="true" :position="position">
                    <template #content>
                        {{POPUP_TEXT}}
                    </template>
                </YMapPopupMarker>

                <YMapPopupMarker :coordinates="CUSTOM_POPUP_COORDS" :draggable="true" :position="position" :show="showCustom">
                    <template #content>
                        <span class="popup">
                            <span class="header">
                                <span class="header_title">{{TITLE}}</span>
                                <button class="header_close" @click="showCustom=false"></button>
                            </span>
                            <span class="description">{{DESCRIPTION}}</span>
                            <button class="action" @click="customPopupAction">
                                {{ACTION}}
                            </button>
                        </span>
                    </template>
                </YMapPopupMarker>
            </YMap>`
    });
    app.mount('#app');
}
