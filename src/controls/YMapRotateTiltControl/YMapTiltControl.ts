import type {YMapListener} from '@yandex/ymaps3-types';
import {YMapCameraRequest} from '@yandex/ymaps3-types/imperative/YMap';
import type {YMapRotateTiltControlProps} from '.';
import {CLICK_TOLERANCE_PX, Position, radToDeg, toggleTilt} from '../utils/angle-utils';
import './YMapTiltControl.css';

const TILT_CONTROL_CLASS = 'ymaps3--rotate-tilt_tilt';
const TILT_CONTROL_DARK_CLASS = 'ymaps3--rotate-tilt_tilt__dark';
const TILT_CONTROL_IN_ACTION_CLASS = 'ymaps3--rotate-tilt_tilt__in-action';
const TILT_CONTROL_TILTED_CLASS = 'ymaps3--rotate-tilt_tilt__tilted';

export class YMapTiltControl extends ymaps3.YMapComplexEntity<YMapRotateTiltControlProps> {
    static readonly __implName = 'YMapTiltControl';
    private _element?: HTMLElement;
    private _domDetach?: () => void;
    private _unwatchThemeContext?: () => void;

    private _listener!: YMapListener;
    private _startTilt?: number;
    private _startMovePosition?: Position;
    private _isClick: boolean = false;

    constructor(props: YMapRotateTiltControlProps) {
        super(props);
        this._listener = new ymaps3.YMapListener({
            onUpdate: (event) => this._onMapUpdate(event.camera)
        });
        this.addChild(this._listener);
    }

    protected _onAttach(): void {
        this._element = document.createElement('ymaps3');
        this._element.classList.add(TILT_CONTROL_CLASS);
        const {tilt, tiltRange} = this.root;
        this._element.textContent = tilt === tiltRange.min ? '3D' : '2D';
        this._element.addEventListener('click', this._toggleMapTilt);
        this._element.addEventListener('mousedown', this._onTiltStart);

        this._domDetach = ymaps3.useDomContext(this, this._element, null);

        this._unwatchThemeContext = this._watchContext(ymaps3.ThemeContext, () => this._updateTheme(), {
            immediate: true
        });
    }

    protected _onDetach(): void {
        this._element?.removeEventListener('click', this._toggleMapTilt);
        this._element?.removeEventListener('mousedown', this._onTiltStart);
        this._domDetach?.();
        this._domDetach = undefined;
        this._element = undefined;
        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;
    }

    private _updateTheme(): void {
        if (!this._element) {
            return;
        }
        // The ThemeContext may not be provisioned yet at the moment the immediate watcher fires
        // (this entity is built in the constructor), so fall back to the map's own theme.
        const theme = this._consumeContext(ymaps3.ThemeContext)?.theme ?? this.root?.theme;
        this._element.classList.toggle(TILT_CONTROL_DARK_CLASS, theme === 'dark');
    }

    private _toggleMapTilt = (): void => {
        if (!this.root || !this._isClick) {
            return;
        }
        const {duration, easing} = this._props;
        const {
            tilt,
            tiltRange: {max, min}
        } = this.root;
        const targetTiltDeg = toggleTilt(tilt, min, max);
        this.root.setCamera({tilt: targetTiltDeg, duration, easing});
    };

    private _onTiltStart = (event: MouseEvent) => {
        const isLeftClick = event.button === 0;
        if (!isLeftClick) {
            return;
        }
        this._isClick = true;
        this._startTilt = this.root?.tilt;
        this._startMovePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this._element?.classList.toggle(TILT_CONTROL_IN_ACTION_CLASS, true);
        this._addTiltEventListeners();
    };

    private _onTiltMove = (event: MouseEvent) => {
        if (!this._startMovePosition || this._startTilt === undefined || !this.root) {
            return;
        }
        const delta = this._startMovePosition.y - event.clientY;

        if (Math.abs(delta) < CLICK_TOLERANCE_PX) {
            return;
        }
        const deltaTilt = (Math.PI * delta) / this.root.size.y;
        this._isClick = false;
        this.root.setCamera({tilt: this._startTilt + deltaTilt});
    };

    private _onTiltEnd = () => {
        this._element?.classList.toggle(TILT_CONTROL_IN_ACTION_CLASS, false);
        this._removeTiltEventListeners();
    };

    private _onMapUpdate({tilt: radTilt}: YMapCameraRequest): void {
        if (this._element === undefined) {
            return;
        }
        const degTilt = radToDeg(radTilt ?? 0);
        const isMinTilt = Math.round(degTilt) === this.root.tiltRange.min;

        this._element.style.transform = `rotateX(${degTilt}deg)`;
        this._element.textContent = isMinTilt ? '3D' : '2D';
        this._element.classList.toggle(TILT_CONTROL_TILTED_CLASS, !isMinTilt);
    }

    private _addTiltEventListeners(): void {
        window.addEventListener('mousemove', this._onTiltMove);
        window.addEventListener('mouseup', this._onTiltEnd);
    }

    private _removeTiltEventListeners(): void {
        window.removeEventListener('mousemove', this._onTiltMove);
        window.removeEventListener('mouseup', this._onTiltEnd);
    }
}
