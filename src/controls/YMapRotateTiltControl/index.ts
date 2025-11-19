import type {EasingFunctionDescription, YMapControl} from '@yandex/ymaps3-types';
import type {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {YMapRotateControl} from './YMapRotateControl';
import {YMapTiltControl} from './YMapTiltControl';

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

export const YMapRotateTiltControlVuefyOptions: CustomVuefyOptions<YMapRotateTiltControl> = {
    props: {
        easing: [Function, String, Object] as TVue.PropType<EasingFunctionDescription>,
        duration: {type: Number, default: defaultProps.duration}
    }
};

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
    static readonly __implName = 'YMapRotateTiltControl';
    static defaultProps = defaultProps;
    static [ymaps3.optionsKeyVuefy] = YMapRotateTiltControlVuefyOptions;

    private _rotateControl!: YMapRotateControl;
    private _tiltControl!: YMapTiltControl;
    private _control!: YMapControl;

    constructor(props: YMapRotateTiltControlProps) {
        super(props);
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
