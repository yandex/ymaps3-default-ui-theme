import {EasingFunctionDescription} from '@yandex/ymaps3-types';
import type {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {YMapRotateTiltControl} from '..';

export const YMapRotateTiltControlVuefyOptions: CustomVuefyOptions<YMapRotateTiltControl> = {
    props: {
        easing: [Function, String, Object] as TVue.PropType<EasingFunctionDescription>,
        duration: Number
    }
};
