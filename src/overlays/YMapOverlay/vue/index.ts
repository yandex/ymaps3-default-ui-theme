import type {LngLatBounds} from '@yandex/ymaps3-types';
import {CustomVuefyFn, CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {YMapOverlay, YMapOverlayProps} from '../';

type YMapOverlayVueProps = Omit<YMapOverlayProps, 'htmlElement'>;

export const YMapOverlayVuefyOptions: CustomVuefyOptions<YMapOverlay, YMapOverlayVueProps> = {
    props: {
        bounds: {type: Object as TVue.PropType<LngLatBounds>, required: true}
    }
};

type YMapOverlaySlots = {
    default: void;
};

export const YMapOverlayVuefyOverride: CustomVuefyFn<YMapOverlay> = (YMapOverlayI, props, {vuefy, Vue}) => {
    const YMapOverlayV = vuefy.entity(YMapOverlayI);
    const {htmlElement, ...overridedProps} = props;
    return Vue.defineComponent({
        name: 'YMapOverlay',
        props: overridedProps,
        slots: Object as TVue.SlotsType<YMapOverlaySlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | null> = Vue.ref(null);
            const overlayHTMLElement = document.createElement('ymaps3');

            const overlayRef = Vue.ref<{entity: YMapOverlay} | null>(null);
            const overlayEntity = Vue.computed(() => overlayRef.value?.entity);

            Vue.watchEffect(() => {
                content.value = slots.default?.();
            });

            expose({entity: overlayEntity});
            return () =>
                Vue.h(
                    YMapOverlayV,
                    {
                        ...props,
                        htmlElement: overlayHTMLElement,
                        ref: overlayRef
                    },
                    () => Vue.h(Vue.Teleport, {to: overlayHTMLElement}, [content.value])
                );
        }
    });
};
