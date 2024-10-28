import type {EasingFunctionDescription, YMapControl, YMapListener} from '@yandex/ymaps3-types';
import {YMapCameraRequest} from '@yandex/ymaps3-types/imperative/YMap';
import type {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {Position, getDeltaAzimuth, toggleRotate} from '../utils/angle-utils';

import './index.css';

/**
 * YMapRotateControl props
 */
export type YMapRotateControlProps = {
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
};
const defaultProps = Object.freeze({duration: 200});
type DefaultProps = typeof defaultProps;

export const YMapRotateControlVuefyOptions: CustomVuefyOptions<YMapRotateControl> = {
    props: {
        easing: [Function, String, Object] as TVue.PropType<EasingFunctionDescription>,
        duration: {type: Number, default: defaultProps.duration}
    }
};

/**
 * Display rotate control on a map.
 *
 * @example
 * ```javascript
 * const controls = new YMapControls({position: 'right'});
 * const {YMapRotateControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
 * const rotateControl = new YMapRotateControl({});
 * controls.addChild(rotateControl);
 * map.addChild(controls);
 * ```
 */
export class YMapRotateControl extends ymaps3.YMapComplexEntity<YMapRotateControlProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [ymaps3.optionsKeyVuefy] = YMapRotateControlVuefyOptions;
    private _control: YMapControl;
    private _rotateControl: InternalRotateControl;

    constructor(props: YMapRotateControlProps) {
        super(props);
        this._control = new ymaps3.YMapControl({transparent: true});
        this._rotateControl = new InternalRotateControl(this._props);

        this._control.addChild(this._rotateControl);
        this.addChild(this._control);
    }

    protected _onUpdate(): void {
        this._rotateControl.update(this._props);
    }
}

const ROTATE_CONTROL_CLASS = 'ymaps3--rotate-control';

export class InternalRotateControl extends ymaps3.YMapComplexEntity<YMapRotateControlProps, DefaultProps> {
    private _listener!: YMapListener;

    private _element?: HTMLElement;
    private _domDetach: () => void;
    private _isClick = false;
    private _controlCenterPosition?: Position;
    private _startMovePosition?: Position;
    private _startAzimuth?: number;

    constructor(props: YMapRotateControlProps) {
        super(props);
        this._listener = new ymaps3.YMapListener({
            onUpdate: (event) => this._onMapUpdate(event.camera)
        });
        this.addChild(this._listener);
    }

    protected _onAttach(): void {
        this._element = document.createElement('ymaps3');
        this._element.textContent = 'N';
        this._element.classList.add(ROTATE_CONTROL_CLASS);
        this._element.addEventListener('click', this._toggleMapRotate);
        this._element.addEventListener('mousedown', this._onRotateStart);

        this._domDetach = ymaps3.useDomContext(this, this._element, null);
    }

    protected _onDetach(): void {
        this._element?.removeEventListener('click', this._toggleMapRotate);
        this._element?.removeEventListener('mousedown', this._onRotateStart);
        this._domDetach?.();
        this._domDetach = undefined;
    }

    private _onMapUpdate({azimuth}: YMapCameraRequest): void {
        if (!this._element) {
            return;
        }
        this._element.style.transform = `rotateZ(${azimuth}rad)`;
    }

    private _toggleMapRotate = (): void => {
        if (!this.root || !this._isClick) {
            return;
        }
        const {duration, easing} = this._props;
        let targetAzimuth = toggleRotate(this.root.azimuth);
        this.root.setCamera({azimuth: targetAzimuth, duration, easing});
    };

    private _onRotateStart = (event: MouseEvent) => {
        const isLeftClick = event.button === 0;
        if (!isLeftClick || !this._element) {
            return;
        }
        this._isClick = true;

        const {x, y, height, width} = this._element.getBoundingClientRect();

        this._controlCenterPosition = {
            x: x + width / 2,
            y: y + height / 2
        };
        this._startMovePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this._startAzimuth = this.root?.azimuth;
        this._addRotateEventListeners();
    };

    private _onRotateMove = (event: MouseEvent) => {
        if (!this._controlCenterPosition || !this._startMovePosition || this._startAzimuth === undefined) {
            return;
        }
        const deltaAzimuth = getDeltaAzimuth(this._startMovePosition, this._controlCenterPosition, {
            x: event.pageX,
            y: event.pageY
        });
        this._isClick = false;
        this.root?.setCamera({azimuth: this._startAzimuth + deltaAzimuth});
    };

    private _onRotateEnd = () => {
        this._removeRotateEventListeners();
    };

    private _addRotateEventListeners = (): void => {
        window.addEventListener('mousemove', this._onRotateMove);
        window.addEventListener('mouseup', this._onRotateEnd);
    };
    private _removeRotateEventListeners = (): void => {
        window.removeEventListener('mousemove', this._onRotateMove);
        window.removeEventListener('mouseup', this._onRotateEnd);
    };
}
