import type {EasingFunctionDescription, YMapControl} from '@yandex/ymaps3-types';
import {YMapRotateControl} from './YMapRotateControl';
import {YMapTiltControl} from './YMapTiltControl';
import {YMapRotateTiltControlVuefyOptions} from './vue';

/**
 * YMapRotateTiltControl props
 */
export type YMapRotateTiltControlProps = {
    /** Easing function for map location animation */
    easing?: EasingFunctionDescription;
    /** Map location animate duration */
    duration?: number;
};
const defaultProps = Object.freeze({duration: 200});
type DefaultProps = typeof defaultProps;

/**
 * Display tilt and rotation controls on a map.
 *
 * @example
 * ```javascript
 * const controls = new YMapControls({position: 'right'});
 * const {YMapRotateTiltControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
 * const rotateTiltControl = new YMapRotateTiltControl({});
 * controls.addChild(rotateTiltControl);
 * map.addChild(controls);
 * ```
 */
export class YMapRotateTiltControl extends ymaps3.YMapComplexEntity<YMapRotateTiltControlProps, DefaultProps> {
    static defaultProps = defaultProps;
    static [ymaps3.optionsKeyVuefy] = YMapRotateTiltControlVuefyOptions;

    private _rotateControl!: YMapRotateControl;
    private _tiltControl!: YMapTiltControl;
    private _control!: YMapControl;

    protected __implGetDefaultProps() {
        return YMapRotateTiltControl.defaultProps;
    }

    constructor(props: YMapRotateTiltControlProps) {
        super(props);
    }

    protected _onAttach(): void {
        this._control = new ymaps3.YMapControl({transparent: true});
        this._rotateControl = new YMapRotateControl(this._props);
        this._tiltControl = new YMapTiltControl(this._props);

        this._rotateControl.addChild(this._tiltControl);
        this._control.addChild(this._rotateControl);
        this.addChild(this._control);
    }
    protected _onUpdate(): void {
        this._rotateControl.update(this._props);
        this._tiltControl.update(this._props);
    }
}
