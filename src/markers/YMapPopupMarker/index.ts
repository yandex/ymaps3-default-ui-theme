import {LngLat, YMapMarker, YMapMarkerProps} from '@yandex/ymaps3-types';
import {YMapPopupMarkerReactifyOverride} from './react';
import {YMapPopupMarkerVuefyOptions, YMapPopupMarkerVuefyOverride} from './vue';

import './index.css';
import tailSVG from './tail.svg';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';
export type YMapPopupPositionProps =
    | VerticalPosition
    | HorizontalPosition
    | `${VerticalPosition} ${HorizontalPosition}`
    | `${HorizontalPosition} ${VerticalPosition}`;

export type YMapPopupContentProps = string | (() => HTMLElement);

export type YMapPopupMarkerProps = YMapMarkerProps & {
    /** The function of creating popup content */
    content: YMapPopupContentProps;
    /** The position of the popup in relation to the point it is pointing to */
    position?: YMapPopupPositionProps;
    /** The offset in pixels between the popup pointer and the point it is pointing to. */
    offset?: number;
    /** Hide or show popup on map */
    show?: boolean;
    /** Popup closing callback */
    onClose?: () => void;
    /** Popup opening callback */
    onOpen?: () => void;
};

const defaultProps = Object.freeze({position: 'top', offset: 0, show: true});
type DefaultProps = typeof defaultProps;

/**
 * `YMapPopupMarker` is a popup with customized content.
 * @example
 * ```js
 * const popup = new YMapPopupMarker({
 *  content: () => createPopupContentHTMLElement(),
 *  position: 'top',
 *  onOpen:() => console.log('open'),
 *  onClose:() => console.log('close'),
 *  // support YMapMarker props
 *  coordinates: POPUP_COORD,
 *  draggable: true,
 * });
 * map.addChild(popup);
 * ```
 */
export class YMapPopupMarker extends ymaps3.YMapComplexEntity<YMapPopupMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [ymaps3.overrideKeyReactify] = YMapPopupMarkerReactifyOverride;
    static [ymaps3.overrideKeyVuefy] = YMapPopupMarkerVuefyOverride;
    static [ymaps3.optionsKeyVuefy] = YMapPopupMarkerVuefyOptions;

    public get isOpen() {
        return this._props.show;
    }
    private _markerElement: HTMLElement;
    private _popupContainer: HTMLElement;
    private _popupTail: HTMLElement;
    private _marker: YMapMarker;

    public get coordinates(): LngLat {
        return this._marker.coordinates;
    }

    private _togglePopup(forceShowPopup?: boolean): void {
        const openPopup = forceShowPopup ?? !this._props.show;

        this._markerElement.classList.toggle('ymaps3--popup-marker__hide', !openPopup);

        if (openPopup) {
            this._props.onOpen?.();
        } else {
            this._props.onClose?.();
        }

        this._props.show = openPopup;
    }

    protected _onAttach(): void {
        this._markerElement = document.createElement('ymaps3');
        this._markerElement.classList.add('ymaps3--popup-marker');

        this._popupContainer = document.createElement('ymaps3');
        this._popupContainer.classList.add('ymaps3--popup-marker_container');

        if (typeof this._props.content === 'string') {
            this._popupContainer.textContent = this._props.content;
        } else {
            this._popupContainer.appendChild(this._props.content());
        }

        this._popupTail = document.createElement('ymaps3');
        this._popupTail.classList.add('ymaps3--popup-marker_tail');
        this._popupTail.innerHTML = tailSVG;

        this._togglePopup(this._props.show);
        this._updatePosition();
        this._updateOffset();

        this._markerElement.appendChild(this._popupContainer);
        this._markerElement.appendChild(this._popupTail);

        this._marker = new ymaps3.YMapMarker(this._props, this._markerElement);
        this.addChild(this._marker);

        this._watchContext(ymaps3.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected _onUpdate(propsDiff: Partial<YMapPopupMarkerProps>): void {
        if (propsDiff.position !== undefined) {
            this._updatePosition();
        }
        if (propsDiff.offset !== undefined) {
            this._updateOffset();
        }

        if (propsDiff.content !== undefined) {
            this._popupContainer.innerHTML = '';

            if (typeof this._props.content === 'string') {
                this._popupContainer.textContent = this._props.content;
            } else {
                this._popupContainer.appendChild(this._props.content());
            }
        }

        if (propsDiff.show !== undefined) {
            this._togglePopup(propsDiff.show);
        }

        this._marker.update(this._props);
    }

    protected _onDetach(): void {
        this.removeChild(this._marker);
    }

    private _updateTheme() {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        const {theme} = themeCtx;
        this._popupContainer.classList.toggle('ymaps3--popup-marker__dark', theme === 'dark');
        this._popupTail.classList.toggle('ymaps3--popup-marker__dark', theme === 'dark');
    }

    private _updateOffset(): void {
        this._markerElement.style.setProperty('--ymaps3-default-offset', `${this._props.offset}px`);
    }

    private _updatePosition(): void {
        const {position} = this._props;
        let verticalPosition: VerticalPosition;
        let horizontalPosition: HorizontalPosition;

        const positionTypeHash: Record<HorizontalPosition | VerticalPosition, 'horizontal' | 'vertical'> = {
            top: 'vertical',
            left: 'horizontal',
            bottom: 'vertical',
            right: 'horizontal'
        };

        if (position === 'top' || position === 'bottom') {
            verticalPosition = position;
        } else if (position === 'left' || position === 'right') {
            horizontalPosition = position;
        } else {
            const [first, second] = position.split(' ') as (HorizontalPosition | VerticalPosition)[];
            if (positionTypeHash[first] === 'vertical' && positionTypeHash[second] === 'horizontal') {
                verticalPosition = first as VerticalPosition;
                horizontalPosition = second as HorizontalPosition;
            } else if (positionTypeHash[first] === 'horizontal' && positionTypeHash[second] === 'vertical') {
                verticalPosition = second as VerticalPosition;
                horizontalPosition = first as HorizontalPosition;
            }
        }

        // check top position
        this._markerElement.classList.toggle('ymaps3--popup-marker__position-top', verticalPosition === 'top');

        // check bottom position
        this._markerElement.classList.toggle('ymaps3--popup-marker__position-bottom', verticalPosition === 'bottom');

        // check left position
        this._markerElement.classList.toggle('ymaps3--popup-marker__position-left', horizontalPosition === 'left');

        // check right position
        this._markerElement.classList.toggle('ymaps3--popup-marker__position-right', horizontalPosition === 'right');
    }
}
