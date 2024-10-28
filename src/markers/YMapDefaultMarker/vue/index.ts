import {YMapFeatureProps, YMapMarkerEventHandler} from '@yandex/ymaps3-types';
import {CustomVuefyFn, CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {YMapDefaultMarker, YMapDefaultMarkerProps, MarkerColorProps, MarkerPopupProps, MarkerSizeProps} from '../';
import {IconName} from '../../../icons';
import {defaultProps} from '../props';

type VuefyMarkerPopup = Omit<MarkerPopupProps, 'content'>;

export const YMapDefaultMarkerVuefyOptions: CustomVuefyOptions<
    YMapDefaultMarker,
    Omit<YMapDefaultMarkerProps, 'popup'> & {popup: VuefyMarkerPopup}
> = {
    props: {
        coordinates: {type: Object, required: true},
        source: String,
        zIndex: {type: Number, default: undefined},
        properties: Object,
        id: String,
        disableRoundCoordinates: {type: Boolean, default: undefined},
        hideOutsideViewport: {type: [Object, Boolean], default: undefined},
        draggable: {type: Boolean, default: undefined},
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
        color: {type: [Object, String] as TVue.PropType<MarkerColorProps>, default: defaultProps.color},
        size: {type: String as TVue.PropType<MarkerSizeProps>, default: defaultProps.size},
        title: {type: String},
        subtitle: {type: String},
        staticHint: {type: Boolean, default: defaultProps.staticHint},
        popup: {type: Object as TVue.PropType<VuefyMarkerPopup>}
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

    return Vue.defineComponent({
        name: 'YMapDefaultMarker',
        props,
        slots: Object as TVue.SlotsType<YMapDefaultMarkerSlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | string | null> = Vue.ref(null);
            const popupHTMLElement = document.createElement('ymaps3');

            const markerRef = Vue.ref<{entity: YMapDefaultMarker} | null>(null);
            const markerEntity = Vue.computed(() => markerRef.value?.entity);

            const popup = Vue.computed<YMapDefaultMarkerProps['popup']>(() => {
                if (slots.popupContent === undefined && props.popup?.content === undefined) {
                    return undefined;
                }

                if (typeof props.popup?.content === 'string') {
                    content.value = props.popup.content;
                } else {
                    content.value = slots.popupContent?.();
                }
                return {...props.popup, content: () => popupHTMLElement};
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
