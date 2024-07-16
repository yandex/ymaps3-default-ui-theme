import {YMapEntity} from '@yandex/ymaps3-types';
import {CustomReactify, OverrideProps, Prettify} from '@yandex/ymaps3-types/reactify/reactify';
import type TReact from 'react';
import {YMapDefaultMarkerProps, MarkerPopupProps, YMapDefaultMarker as YMapDefaultMarkerI} from '..';

type YMapDefaultMarkerReactifiedProps = Prettify<
    OverrideProps<
        YMapDefaultMarkerProps,
        {
            popup?: Omit<MarkerPopupProps, 'content'> & {
                /** The function of creating popup content */
                content: string | (() => TReact.ReactElement);
            };
        }
    >
>;

type YMapDefaultMarkerR = TReact.ForwardRefExoticComponent<
    Prettify<YMapDefaultMarkerReactifiedProps & React.RefAttributes<YMapEntity<YMapDefaultMarkerProps>>>
>;

export const YMapDefaultMarkerReactifyOverride: CustomReactify<YMapDefaultMarkerI, YMapDefaultMarkerR> = (
    YMapDefaultMarkerI,
    {reactify, React, ReactDOM}
) => {
    const YMapDefaultMarkerReactified = reactify.entity(YMapDefaultMarkerI);

    const YMapDefaultMarker = React.forwardRef<YMapDefaultMarkerI, YMapDefaultMarkerReactifiedProps>((props, ref) => {
        const [popupElement] = React.useState(document.createElement('ymaps3'));
        const [content, setContent] = React.useState<React.ReactElement>();

        const popup = React.useMemo(() => {
            if (props.popup === undefined) {
                return undefined;
            }

            if (typeof props.popup.content === 'string') {
                setContent(<>{props.popup.content}</>);
            } else if (typeof props.popup.content === 'function') {
                setContent(props.popup.content());
            }

            return {...props.popup, content: () => popupElement};
        }, [props.popup, popupElement]);

        return (
            <>
                <YMapDefaultMarkerReactified {...props} popup={popup} ref={ref} />
                {ReactDOM.createPortal(content, popupElement)}
            </>
        );
    });
    return YMapDefaultMarker;
};
