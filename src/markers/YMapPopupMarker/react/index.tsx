import {YMapEntity} from '@yandex/ymaps3-types';
import {CustomReactify, OverrideProps, Prettify} from '@yandex/ymaps3-types/reactify/reactify';
import type TReact from 'react';
import {YMapPopupMarker as YMapPopupMarkerI, YMapPopupMarkerProps} from '../';

type YMapPopupMarkerReactifiedProps = Prettify<
    OverrideProps<
        YMapPopupMarkerProps,
        {
            /** The function of creating popup content */
            content: string | (() => TReact.ReactElement);
        }
    >
>;

type YMapPopupMarkerR = TReact.ForwardRefExoticComponent<
    Prettify<YMapPopupMarkerReactifiedProps & React.RefAttributes<YMapEntity<YMapPopupMarkerProps>>>
>;

export const YMapPopupMarkerReactifyOverride: CustomReactify<YMapPopupMarkerI, YMapPopupMarkerR> = (
    YMapPopupMarkerI,
    {reactify, React, ReactDOM}
) => {
    const YMapPopupMarkerReactified = reactify.entity(YMapPopupMarkerI);

    const YMapPopupMarker = React.forwardRef<YMapPopupMarkerI, YMapPopupMarkerReactifiedProps>((props, ref) => {
        const [popupElement] = React.useState(document.createElement('ymaps3'));
        const [content, setContent] = React.useState<React.ReactElement>();

        const popup = React.useMemo(() => {
            if (typeof props.content === 'string') {
                setContent(<>{props.content}</>);
            } else {
                setContent(props.content());
            }
            return () => popupElement;
        }, [props.content, popupElement]);

        return (
            <>
                <YMapPopupMarkerReactified {...props} content={popup} ref={ref} />
                {ReactDOM.createPortal(content, popupElement)}
            </>
        );
    });
    return YMapPopupMarker;
};
