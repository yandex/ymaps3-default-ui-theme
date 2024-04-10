import type {
    DomDetach,
    YMapCenterZoomLocation,
    YMapControl,
    YMapControlCommonButton,
    YMapListener
} from '@yandex/ymaps3-types';
import type {EasingFunctionDescription} from '@yandex/ymaps3-types/common/types';
import type {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';

import './index.css';

/**
 * YMapZoomControl props
 */
type YMapZoomControlProps = {
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
};

const defaultProps = Object.freeze({duration: 200});

type DefaultProps = typeof defaultProps;

const YMapZoomControlVuefyOptions: CustomVuefyOptions<YMapZoomControl> = {
    props: {
        easing: [String, Object, Function] as TVue.PropType<EasingFunctionDescription>,
        duration: {type: Number, default: defaultProps.duration}
    }
};

class YMapZoomCommonControl extends ymaps3.YMapGroupEntity<YMapZoomControlProps> {
    protected _zoomIn!: YMapControlCommonButton;
    protected _zoomOut!: YMapControlCommonButton;
    protected _listener!: YMapListener;

    private _currentZoom: number = 10;

    protected _detachDom?: DomDetach;
    protected _element?: HTMLElement;
    private _unwatchThemeContext?: () => void;
    private _unwatchControlContext?: () => void;

    constructor(props: YMapZoomControlProps) {
        super(props);
        this._onMapUpdate = this._onMapUpdate.bind(this);
    }

    private _onMapUpdate({location}: {location: YMapCenterZoomLocation}): void {
        this._currentZoom = location.zoom;
        this._onUpdate();
    }

    private _changeZoom(delta: number): void {
        const newZoom = this._currentZoom + delta;
        const map = this.root;
        map.update({
            location: {
                zoom: newZoom,
                duration: this._props.duration,
                easing: this._props.easing
            }
        });
        this._currentZoom = newZoom;
        this._onUpdate();
    }

    protected override _onAttach(): void {
        this._element = document.createElement('ymaps3');
        this._element.classList.add('ymaps3--zoom-control');

        this._detachDom = ymaps3.useDomContext(this, this._element, this._element);

        const zoomInElement = document.createElement('ymaps3');
        zoomInElement.classList.add('ymaps3--zoom-control__in');

        const zoomOutElement = document.createElement('ymaps3');
        zoomOutElement.classList.add('ymaps3--zoom-control__out');

        this._zoomIn = new ymaps3.YMapControlCommonButton({
            onClick: () => this._changeZoom(1),
            element: zoomInElement
        });

        this._zoomOut = new ymaps3.YMapControlCommonButton({
            onClick: () => this._changeZoom(-1),
            element: zoomOutElement
        });

        this._listener = new ymaps3.YMapListener({onUpdate: this._onMapUpdate});

        this.addChild(this._zoomIn).addChild(this._zoomOut).addChild(this._listener);
        this._currentZoom = this.root!.zoom;

        this._unwatchThemeContext = this._watchContext(
            ymaps3.ThemeContext,
            () => {
                if (this._element) {
                    this._updateTheme({zoomIn: zoomInElement, zoomOut: zoomOutElement});
                }
            },
            {immediate: true}
        );

        this._unwatchControlContext = this._watchContext(
            ymaps3.ControlContext,
            () => {
                if (this._element) {
                    this._updateOrientation(this._element);
                }
            },
            {immediate: true}
        );
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
        this._element = undefined;
        this.removeChild(this._zoomIn).removeChild(this._zoomOut).removeChild(this._listener);
        this._unwatchThemeContext?.();
        this._unwatchControlContext?.();
    }

    protected override _onUpdate() {
        const map = this.root;
        this._zoomIn.update({
            disabled: this._currentZoom >= map.zoomRange.max
        });

        this._zoomOut.update({
            disabled: this._currentZoom <= map.zoomRange.min
        });
    }

    private _updateTheme(elements: {zoomOut: HTMLElement; zoomIn: HTMLElement}): void {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const {zoomIn, zoomOut} = elements;
        const zoomInDarkClassName = 'ymaps3--zoom-control__dark-in';
        const zoomOutDarkClassName = 'ymaps3--zoom-control__dark-out';
        zoomIn.classList.toggle(zoomInDarkClassName, theme === 'dark');
        zoomOut.classList.toggle(zoomOutDarkClassName, theme === 'dark');
    }

    private _updateOrientation(element: HTMLElement): void {
        const controlCtx = this._consumeContext(ymaps3.ControlContext);
        if (!controlCtx) {
            return;
        }
        const verticalZoomClassName = 'ymaps3--zoom-control_vertical';
        const horizontalZoomClassName = 'ymaps3--zoom-control_horizontal';
        const orientation = controlCtx.position[2];
        element.classList.toggle(verticalZoomClassName, orientation === 'vertical');
        element.classList.toggle(horizontalZoomClassName, orientation === 'horizontal');
    }
}

/**
 * Display zoom control on a map.
 *
 * @example
 * ```javascript
 * const controls = new YMapControls({position: 'right'});
 * const zoomControl = new YMapZoomControl();
 * controls.addChild(zoomControl);
 * map.addChild(controls);
 * ```
 */
class YMapZoomControl extends ymaps3.YMapComplexEntity<YMapZoomControlProps> {
    static [ymaps3.optionsKeyVuefy] = YMapZoomControlVuefyOptions;

    static defaultProps = defaultProps;

    private _control!: YMapControl;
    private _zoom!: YMapZoomCommonControl;

    protected __implGetDefaultProps(): DefaultProps {
        return YMapZoomControl.defaultProps;
    }

    protected override _onAttach(): void {
        this._zoom = new YMapZoomCommonControl(this._props);
        this._control = new ymaps3.YMapControl().addChild(this._zoom);
        this.addChild(this._control);
    }

    protected override _onUpdate(props: YMapZoomControlProps): void {
        this._zoom.update(props);
    }

    protected override _onDetach(): void {
        this.removeChild(this._control);
    }
}

export {YMapZoomControl, YMapZoomControlProps};
