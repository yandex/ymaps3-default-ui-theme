import {LngLat, YMapMarker, YMapMarkerProps} from '@yandex/ymaps3-types';
import {IconColor, IconName, iconColors, icons} from '../../icons';
import {YMapPopupMarker, YMapPopupMarkerProps} from '../YMapPopupMarker';
import {YMapDefaultMarkerReactifyOverride} from './react';
import {YMapDefaultMarkerVuefyOptions, YMapDefaultMarkerVuefyOverride} from './vue';

import microPoiStrokeSVG from './backgrounds/micro-poi-stroke.svg';
import microPoiSVG from './backgrounds/micro-poi.svg';
import normalPinStrokeSVG from './backgrounds/normal-pin-stroke.svg';
import normalPinSVG from './backgrounds/normal-pin.svg';
import smallPoiStrokeSVG from './backgrounds/small-poi-stroke.svg';
import smallPoiSVG from './backgrounds/small-poi.svg';

import './index.css';

const GLYPH_DEFAULT_COLOR = '#FFFFFF';

const MARKER_BASE_CLASS = 'ymaps3--default-marker-point';
const MARKER_BASE_DARK_CLASS = 'ymaps3--default-marker-point_dark';

const NORMAL_SIZE_MARKER_CLASS = 'ymaps3--pin';
const SMALL_SIZE_MARKER_CLASS = 'ymaps3--small-poi';
const MICRO_SIZE_MARKER_CLASS = 'ymaps3--micro-poi';

const BACKGROUND_CLASS = 'ymaps3--default-marker__background';
const STROKE_CLASS = 'ymaps3--default-marker__stroke';
const ICON_CLASS = 'ymaps3--default-marker__icon';

const HINT_CLASS = 'ymaps3--hint';
const HINT_TITLE_CLASS = 'ymaps3--hint-title';
const HINT_SUBTITLE_CLASS = 'ymaps3--hint-subtitle';
const HINT_CLASS_WITH_SUBTITLE = 'ymaps3--hint__big';
const HINT_STABLE = 'ymaps3--hint__stable';
const HINT_HOVERED = 'ymaps3--hint__hovered';

const NORMAL_SIZE_MARKER_HEIGHT = 61;
const NORMAL_SIZE_MARKER_WIDTH = 46;

const SMALL_SIZE_MARKER_WIDTH = 24;

const MICRO_SIZE_MARKER_WIDTH = 14;

const DISTANCE_BETWEEN_POPUP_AND_MARKER = 8;

export type ThemesColor = {
    day: string;
    night: string;
    iconDay?: string;
    iconNight?: string;
    strokeDay?: string;
    strokeNight?: string;
};
export type MarkerColorProps = IconColor | ThemesColor;
export type MarkerSizeProps = 'normal' | 'small' | 'micro';
export type MarkerPopupProps = Omit<YMapPopupMarkerProps, keyof YMapMarkerProps>;

export type YMapDefaultMarkerProps = YMapMarkerProps & {
    iconName?: IconName;
    color?: MarkerColorProps;
    size?: MarkerSizeProps;
    title?: string;
    subtitle?: string;
    staticHint?: boolean;
    popup?: MarkerPopupProps;
};

const defaultProps = Object.freeze({color: 'red', size: 'small', staticHint: true});
type DefaultProps = typeof defaultProps;

type BackgroundAndIcon = {background: HTMLElement; stroke: HTMLElement; icon: HTMLElement};

export class YMapDefaultMarker extends ymaps3.YMapComplexEntity<YMapDefaultMarkerProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [ymaps3.overrideKeyReactify] = YMapDefaultMarkerReactifyOverride;
    static [ymaps3.overrideKeyVuefy] = YMapDefaultMarkerVuefyOverride;
    static [ymaps3.optionsKeyVuefy] = YMapDefaultMarkerVuefyOptions;

    private _marker: YMapMarker;
    private _markerElement: HTMLElement;

    private _color: ThemesColor;
    private _background: HTMLElement;
    private _stroke?: HTMLElement;
    private _icon?: HTMLElement;

    private _hintContainer: HTMLElement;
    private _titleHint: HTMLElement;
    private _subtitleHint: HTMLElement;

    private _popup?: YMapPopupMarker;

    public get coordinates(): LngLat {
        return this._marker.coordinates;
    }

    constructor(props: YMapDefaultMarkerProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._color = this._getColor();

        const {size, title, subtitle} = this._props;

        this._markerElement = document.createElement('ymaps3');
        this._markerElement.classList.add(MARKER_BASE_CLASS);
        this._updateMarkerSize();

        switch (size) {
            case 'normal':
                const normal = this._createNormalPin();
                this._icon = normal.icon;
                this._background = normal.background;
                this._stroke = normal.stroke;
                break;
            case 'small':
                const small = this._createSmallPoi();
                this._icon = small.icon;
                this._background = small.background;
                this._stroke = small.stroke;
                break;
            case 'micro':
                const micro = this._createMicroPoi();
                this._stroke = micro.stroke;
                this._background = micro.background;
                this._icon = micro.icon;
                break;
            default:
                throw new Error(
                    'Unknown size has been specified. The following sizes are available: normal, small and micro.'
                );
        }

        this._markerElement.appendChild(this._background);
        if (this._stroke) {
            this._markerElement.appendChild(this._stroke);
        }
        if (this._icon) {
            this._markerElement.appendChild(this._icon);
        }

        this._hintContainer = this._createHintContainer();
        if (title || subtitle) {
            this._markerElement.appendChild(this._hintContainer);
        }

        this._marker = new ymaps3.YMapMarker(
            {
                ...this._props,
                onClick: this._onMarkerClick,
                onDragMove: this._onMarkerDragMove
            },
            this._markerElement
        );
        this.addChild(this._marker);

        if (this._props.popup) {
            this._popup = this._createPopupMarker();
            this.addChild(this._popup);
        }

        this._watchContext(ymaps3.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected _onUpdate(propsDiff: Partial<YMapDefaultMarkerProps>, oldProps: YMapDefaultMarkerProps): void {
        const {title, subtitle} = this._props;
        if (propsDiff.color !== undefined) {
            this._color = this._getColor();
            this._updateTheme();
        }

        // popup props is changed
        if (this._props.popup !== oldProps.popup) {
            if (this._props.popup === undefined && oldProps.popup !== undefined) {
                this.removeChild(this._popup);
                this._popup = undefined;
            } else if (this._props.popup !== undefined && oldProps.popup === undefined) {
                this._popup = this._createPopupMarker();
                this.addChild(this._popup);
            } else {
                this._popup.update(this._props.popup);
            }
        }

        if (propsDiff.size !== undefined) {
            this._updateMarkerSize();
            this._updateSVG();
            if (this._popup) {
                this._popup.update({offset: this._getPopupOffset()});
            }
        }

        if (this._props.iconName !== oldProps.iconName) {
            const icon = this._getIcon();
            this._icon.innerHTML = icon;
        }

        this._titleHint.textContent = title ?? '';
        this._subtitleHint.textContent = subtitle ?? '';
        this._hintContainer.classList.toggle(HINT_CLASS_WITH_SUBTITLE, subtitle !== undefined);
        const hintAttached = this._markerElement.contains(this._hintContainer);
        if (!hintAttached && (title !== undefined || subtitle !== undefined)) {
            this._markerElement.appendChild(this._hintContainer);
        } else if (hintAttached && title === undefined && subtitle === undefined) {
            this._markerElement.removeChild(this._hintContainer);
        }

        if (propsDiff.staticHint !== undefined) {
            this._hintContainer.classList.toggle(HINT_STABLE, this._props.staticHint);
            this._hintContainer.classList.toggle(HINT_HOVERED, !this._props.staticHint);
        }

        this._marker.update({...this._props, onClick: this._onMarkerClick});
    }

    protected override _onDetach(): void {
        if (this._popup) {
            this.removeChild(this._popup);
        }
        this.removeChild(this._marker);
    }

    private _createPopupMarker() {
        return new YMapPopupMarker({
            ...this._props,
            ...this._props.popup,
            draggable: false,
            show: this._props.popup.show ?? false,
            offset: this._props.popup.offset ?? this._getPopupOffset(),
            zIndex: 1000
        });
    }

    private _createHintContainer(): HTMLElement {
        const {title, subtitle, staticHint} = this._props;
        const hintContainer = document.createElement('ymaps3');
        this._titleHint = document.createElement('ymaps3');
        this._subtitleHint = document.createElement('ymaps3');

        hintContainer.classList.add(HINT_CLASS);
        hintContainer.classList.add(staticHint ? HINT_STABLE : HINT_HOVERED);
        hintContainer.classList.toggle(HINT_CLASS_WITH_SUBTITLE, subtitle !== undefined);
        this._titleHint.classList.add(HINT_TITLE_CLASS);
        this._subtitleHint.classList.add(HINT_SUBTITLE_CLASS);

        this._titleHint.textContent = title ?? '';
        this._subtitleHint.textContent = subtitle ?? '';

        hintContainer.appendChild(this._titleHint);
        hintContainer.appendChild(this._subtitleHint);
        return hintContainer;
    }

    private _onMarkerClick: YMapDefaultMarkerProps['onClick'] = (...args) => {
        if (this._popup) {
            this._popup.update({show: this._popup.isOpen});
        }
        this._props.onClick?.(...args);
    };

    private _onMarkerDragMove: YMapDefaultMarkerProps['onDragMove'] = (coordinates) => {
        if (this._popup) {
            this._popup.update({coordinates});
        }
        this._props.onDragMove?.(coordinates);
    };

    private _updateTheme() {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        const theme = themeCtx.theme;

        const strokeColor =
            theme === 'light'
                ? this._color.strokeDay ?? GLYPH_DEFAULT_COLOR
                : this._color.strokeNight ?? GLYPH_DEFAULT_COLOR;
        const iconColor =
            theme === 'light'
                ? this._color.iconDay ?? GLYPH_DEFAULT_COLOR
                : this._color.iconNight ?? GLYPH_DEFAULT_COLOR;
        const backgroundColor = theme === 'light' ? this._color.day : this._color.night;
        this._markerElement.classList.toggle(MARKER_BASE_DARK_CLASS, theme === 'dark');

        switch (this._props.size) {
            case 'normal':
                this._background.style.color = backgroundColor;
                this._stroke.style.color = strokeColor;
                this._icon.style.color = iconColor;
                break;
            case 'small':
                this._background.style.color = backgroundColor;
                this._stroke.style.color = strokeColor;
                this._icon.style.color = iconColor;
                break;
            case 'micro':
                this._background.style.color = backgroundColor;
                this._stroke.style.color = strokeColor;
                break;
        }
    }

    private _updateMarkerSize() {
        const {size} = this._props;
        this._markerElement.classList.toggle(NORMAL_SIZE_MARKER_CLASS, size === 'normal');
        this._markerElement.classList.toggle(SMALL_SIZE_MARKER_CLASS, size === 'small');
        this._markerElement.classList.toggle(MICRO_SIZE_MARKER_CLASS, size === 'micro');
    }

    private _updateSVG() {
        const {size} = this._props;
        this._icon.innerHTML = this._getIcon();
        switch (size) {
            case 'normal':
                this._background.innerHTML = normalPinSVG;
                this._stroke.innerHTML = normalPinStrokeSVG;
                break;
            case 'small':
                this._background.innerHTML = smallPoiSVG;
                this._stroke.innerHTML = smallPoiStrokeSVG;
                break;
            case 'micro':
                this._background.innerHTML = microPoiSVG;
                this._stroke.innerHTML = microPoiStrokeSVG;
                break;
        }
    }

    private _getPopupOffset(): number {
        const {size} = this._props;
        let offset: number;
        switch (size) {
            case 'normal':
                const popupPosition = this._props.popup.position ?? 'top';

                if (popupPosition.includes('top')) {
                    offset = NORMAL_SIZE_MARKER_HEIGHT + DISTANCE_BETWEEN_POPUP_AND_MARKER;
                } else if (popupPosition.includes('bottom')) {
                    offset = DISTANCE_BETWEEN_POPUP_AND_MARKER;
                } else {
                    offset = NORMAL_SIZE_MARKER_WIDTH / 2 + DISTANCE_BETWEEN_POPUP_AND_MARKER;
                }

                break;
            case 'small':
                offset = SMALL_SIZE_MARKER_WIDTH / 2 + DISTANCE_BETWEEN_POPUP_AND_MARKER;
                break;
            case 'micro':
                offset = MICRO_SIZE_MARKER_WIDTH / 2 + DISTANCE_BETWEEN_POPUP_AND_MARKER;
                break;
        }
        return offset;
    }

    private _getIcon(): string {
        const {size} = this._props;
        if (size === 'micro' || this._props.iconName === undefined) {
            return '';
        }

        return icons[this._props.iconName] ?? '';
    }

    private _getColor(): ThemesColor {
        const color = this._props.color as MarkerColorProps;

        if (typeof color === 'string') {
            if (!iconColors[color]) {
                throw new Error(
                    'The color should be one of the available color presets. If you need a custom color, pass it as an object with fields for day and night.'
                );
            }
            return iconColors[color];
        }

        return color;
    }

    private _createNormalPin(): BackgroundAndIcon {
        const normalPin = document.createElement('ymaps3');
        const normalPinStroke = document.createElement('ymaps3');
        const normalIcon = document.createElement('ymaps3');

        normalPin.classList.add(BACKGROUND_CLASS);
        normalPin.innerHTML = normalPinSVG;

        normalPinStroke.classList.add(STROKE_CLASS);
        normalPinStroke.innerHTML = normalPinStrokeSVG;

        normalIcon.classList.add(ICON_CLASS);
        normalIcon.innerHTML = this._getIcon();

        return {background: normalPin, icon: normalIcon, stroke: normalPinStroke};
    }

    private _createSmallPoi(): BackgroundAndIcon {
        const smallPoi = document.createElement('ymaps3');
        const smallPoiStroke = document.createElement('ymaps3');
        const smallIcon = document.createElement('ymaps3');

        smallPoi.classList.add(BACKGROUND_CLASS);
        smallPoi.innerHTML = smallPoiSVG;

        smallPoiStroke.classList.add(STROKE_CLASS);
        smallPoiStroke.innerHTML = smallPoiStrokeSVG;

        smallIcon.classList.add(ICON_CLASS);
        smallIcon.innerHTML = this._getIcon();

        return {background: smallPoi, icon: smallIcon, stroke: smallPoiStroke};
    }

    private _createMicroPoi(): BackgroundAndIcon {
        const microPoi = document.createElement('ymaps3');
        const microPoiStroke = document.createElement('ymaps3');
        const microIcon = document.createElement('ymaps3');

        microPoi.classList.add(BACKGROUND_CLASS);
        microPoi.innerHTML = microPoiSVG;

        microPoiStroke.classList.add(STROKE_CLASS);
        microPoiStroke.innerHTML = microPoiStrokeSVG;

        microIcon.classList.add(ICON_CLASS);

        return {background: microPoi, stroke: microPoiStroke, icon: microIcon};
    }
}
