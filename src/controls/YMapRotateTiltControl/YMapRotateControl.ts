import type {YMapListener} from '@yandex/ymaps3-types';
import {YMapCameraRequest} from '@yandex/ymaps3-types/imperative/YMap';
import type {YMapRotateTiltControlProps} from '.';
import {Position, getDeltaAzimuth, toggleRotate} from '../utils/angle-utils';
import './YMapRotateControl.css';

const ROTATE_CONTROL_CLASS = 'ymaps3--rotate-tilt_rotate';
const ROTATE_RING_CLASS = 'ymaps3--rotate-tilt_rotate__ring';
const ROTATE_CONTAINER_CLASS = 'ymaps3--rotate-tilt_rotate__container';

export class YMapRotateControl extends ymaps3.YMapGroupEntity<YMapRotateTiltControlProps> {
    private _element?: HTMLElement;
    private _containerElement?: HTMLElement;
    private _ringElement?: HTMLElement;
    private _domDetach?: () => void;

    private _listener!: YMapListener;
    private _isClick: boolean = false;
    private _controlCenterPosition?: Position;
    private _startMovePosition?: Position;
    private _startAzimuth?: number;

    constructor(props: YMapRotateTiltControlProps) {
        super(props);
        this._listener = new ymaps3.YMapListener({
            onUpdate: (event) => this._onMapUpdate(event.camera)
        });
        this.addChild(this._listener);
    }

    protected _onAttach(): void {
        this._element = document.createElement('ymaps3');
        this._element.classList.add(ROTATE_CONTROL_CLASS);

        this._containerElement = document.createElement('ymaps3');
        this._containerElement.classList.add(ROTATE_CONTAINER_CLASS);

        this._ringElement = document.createElement('ymaps3');
        this._ringElement.classList.add(ROTATE_RING_CLASS);
        this._ringElement.addEventListener('click', this._toggleMapRotate);
        this._ringElement.addEventListener('mousedown', this._onRotateStart);

        this._element.appendChild(this._ringElement);
        this._element.appendChild(this._containerElement);

        this._domDetach = ymaps3.useDomContext(this, this._element, this._containerElement);
    }

    protected _onDetach(): void {
        this._ringElement?.removeEventListener('click', this._toggleMapRotate);
        this._ringElement?.removeEventListener('mousedown', this._onRotateStart);
        this._domDetach?.();
        this._domDetach = undefined;
        this._element = undefined;
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

    private _onMapUpdate({azimuth}: YMapCameraRequest): void {
        if (this._ringElement === undefined) {
            return;
        }
        this._ringElement.style.transform = `rotateZ(${azimuth}rad)`;
    }
}
