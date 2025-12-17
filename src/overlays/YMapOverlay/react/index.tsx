import {YMapEntity} from '@yandex/ymaps3-types';
import {CustomReactify, OverrideProps, Prettify} from '@yandex/ymaps3-types/reactify/reactify';
import type TReact from 'react';
import {YMapOverlay as YMapOverlayI, YMapOverlayProps} from '../';

type YMapOverlayReactifiedProps = Prettify<
    Omit<YMapOverlayProps, 'htmlElement'> & {
        /** React children to render inside overlay */
        children?: TReact.ReactNode;
    }
>;

type YMapOverlayR = TReact.ForwardRefExoticComponent<
    Prettify<YMapOverlayReactifiedProps & React.RefAttributes<YMapEntity<YMapOverlayProps>>>
>;

export const YMapOverlayReactifyOverride: CustomReactify<YMapOverlayI, YMapOverlayR> = (
    YMapOverlayI,
    {reactify, React, ReactDOM}
) => {
    const YMapOverlayReactified = reactify.entity(YMapOverlayI);

    const YMapOverlay = React.forwardRef<YMapOverlayI, YMapOverlayReactifiedProps>((props, ref) => {
        const {children, ...restProps} = props;
        const [overlayElement] = React.useState(document.createElement('ymaps3'));

        return (
            <>
                <YMapOverlayReactified {...restProps} htmlElement={overlayElement} ref={ref} />
                {ReactDOM.createPortal(children, overlayElement)}
            </>
        );
    });
    return YMapOverlay;
};
