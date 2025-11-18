import {YMapFeatureProps, YMapMarkerEventHandler} from '@yandex/ymaps3-types';
import {CustomVuefyFn, CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {YMapPopupContentProps, YMapPopupMarker, YMapPopupMarkerProps, YMapPopupPositionProps} from '../';
import {defaultProps} from '../props';

export const YMapPopupMarkerVuefyOptions: CustomVuefyOptions<YMapPopupMarker> = {
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
        onMouseEnter: Function as TVue.PropType<YMapFeatureProps['onMouseEnter']>,
        onMouseLeave: Function as TVue.PropType<YMapFeatureProps['onMouseLeave']>,
        content: {type: [Function, String] as TVue.PropType<YMapPopupContentProps>, required: true},
        position: {type: String as TVue.PropType<YMapPopupPositionProps>, default: defaultProps.position},
        offset: {type: Number, default: defaultProps.offset},
        show: {type: Boolean, default: defaultProps.show},
        onClose: {type: Function as TVue.PropType<YMapPopupMarkerProps['onClose']>},
        onOpen: {type: Function as TVue.PropType<YMapPopupMarkerProps['onOpen']>}
    }
};

type YMapPopupMarkerSlots = {
    content: void;
};

export const YMapPopupMarkerVuefyOverride: CustomVuefyFn<YMapPopupMarker> = (YMapPopupMarkerI, props, {vuefy, Vue}) => {
    const YMapPopupMarkerV = vuefy.entity(YMapPopupMarkerI);
    const {content, ...overridedProps} = props;
    return Vue.defineComponent({
        name: 'YMapPopupMarker',
        props: overridedProps,
        slots: Object as TVue.SlotsType<YMapPopupMarkerSlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | null> = Vue.ref(null);
            const popupHTMLElement = document.createElement('ymaps3');

            const markerRef = Vue.ref<{entity: YMapPopupMarker} | null>(null);
            const markerEntity = Vue.computed(() => markerRef.value?.entity);

            const popup = Vue.computed<YMapPopupMarkerProps['content']>(() => {
                content.value = slots.content?.();
                return () => popupHTMLElement;
            });
            expose({entity: markerEntity});
            return () =>
                Vue.h(
                    YMapPopupMarkerV,
                    {
                        ...props,
                        content: popup.value,
                        ref: markerRef
                    },
                    () => Vue.h(Vue.Teleport, {to: popupHTMLElement}, [content.value])
                );
        }
    });
};
