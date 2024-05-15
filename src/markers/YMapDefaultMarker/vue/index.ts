import {YMapFeatureProps, YMapMarkerEventHandler} from '@yandex/ymaps3-types';
import {CustomVuefyFn, CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {YMapDefaultMarker, YMapDefaultMarkerProps, MarkerColorProps, MarkerPopupProps, MarkerSizeProps} from '../';
import {IconName} from '../../../icons';

export const YMapDefaultMarkerVuefyOptions: CustomVuefyOptions<YMapDefaultMarker> = {
    props: {
        coordinates: {type: Object, required: true},
        source: String,
        zIndex: {type: Number, default: 0},
        properties: Object,
        id: String,
        disableRoundCoordinates: {type: Boolean, default: undefined},
        hideOutsideViewport: {type: [Object, Boolean], default: false},
        draggable: {type: Boolean, default: false},
        mapFollowsOnDrag: {type: [Boolean, Object]},
        onDragStart: Function as TVue.PropType<YMapMarkerEventHandler>,
        onDragEnd: Function as TVue.PropType<YMapMarkerEventHandler>,
        onDragMove: Function as TVue.PropType<YMapMarkerEventHandler>,
        blockEvents: {type: Boolean, default: undefined},
        blockBehaviors: {type: Boolean, default: undefined},
        onDoubleClick: Function as TVue.PropType<YMapFeatureProps['onDoubleClick']>,
        onClick: Function as TVue.PropType<YMapFeatureProps['onClick']>,
        onFastClick: Function as TVue.PropType<YMapFeatureProps['onFastClick']>,
        iconName: {type: String as TVue.PropType<IconName>},
        color: {type: [Object, String] as TVue.PropType<MarkerColorProps>, default: 'red'},
        size: {type: String as TVue.PropType<MarkerSizeProps>, default: 'small'},
        title: {type: String},
        subtitle: {type: String},
        staticHint: {type: Boolean, default: true},
        popup: {type: Object as TVue.PropType<MarkerPopupProps>}
    }
};

type YMapDefaultMarkerSlots = {
    popupContent: void;
};

export const YMapDefaultMarkerVuefyOverride: CustomVuefyFn<YMapDefaultMarker> = (
    YMapDefaultMarkerI,
    props,
    {vuefy, Vue}
) => {
    const YMapDefaultMarkerV = vuefy.entity(YMapDefaultMarkerI);
    const {popup, ...overridedProps} = props;

    return Vue.defineComponent({
        name: 'YMapDefaultMarker',
        props: overridedProps,
        slots: Object as TVue.SlotsType<YMapDefaultMarkerSlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | null> = Vue.ref(null);
            const popupHTMLElement = document.createElement('ymaps3');

            const markerRef = Vue.ref<{entity: YMapDefaultMarker} | null>(null);
            const markerEntity = Vue.computed(() => markerRef.value?.entity);

            const popup = Vue.computed<YMapDefaultMarkerProps['popup']>(() => {
                if (slots.popupContent === undefined) {
                    return undefined;
                }
                content.value = slots.popupContent();
                return {content: () => popupHTMLElement};
            });
            expose({entity: markerEntity});
            return () =>
                Vue.h(
                    YMapDefaultMarkerV,
                    {
                        ...props,
                        popup: popup.value,
                        ref: markerRef
                    },
                    () => Vue.h(Vue.Teleport, {to: popupHTMLElement}, [content.value])
                );
        }
    });
};
