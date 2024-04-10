import {EasingFunctionDescription} from '@yandex/ymaps3-types';
import type {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {YMapTiltControl} from '..';

export const YMapTiltControlVuefyOptions: CustomVuefyOptions<YMapTiltControl> = {
    props: {
        easing: [Function, String, Object] as TVue.PropType<EasingFunctionDescription>,
        duration: Number
    }
};
