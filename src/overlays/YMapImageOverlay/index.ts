import type {YMapFeature, YMapListener} from '@yandex/ymaps3-types';
import type {ImageOverlayProps} from './common';
import {boundsToLeftUpperPoint, boundsToWidthHeight} from './common';
import './index.css';

export class YMapImageOverlay extends ymaps3.YMapComplexEntity<ImageOverlayProps> {
    private _feature: YMapFeature;
    private _element: HTMLElement;
    private _listener: YMapListener;

    constructor(props: ImageOverlayProps) {
        super(props);

        // Create HTML element for the image
        this._element = document.createElement('div');
        this._element.className = `element ${props.className ?? ''}`;

        this._feature = new ymaps3.YMapFeature({
            geometry: boundsToLeftUpperPoint(props.bounds),
            style: {
                element: this._element
            }
        });

        this._listener = new ymaps3.YMapListener({
            onUpdate: () => this._updateSize()
        });
    }

    protected _onAttach(): void {
        const {bounds, image} = this._props;

        const {width, height} = boundsToWidthHeight(this.root, bounds);

        Object.assign(this._element.style, {
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage: `url(${image})`
        });

        this.addChild(this._feature);
        this.addChild(this._listener);
    }

    private _updateSize(): void {
        const {bounds} = this._props;
        const {width, height} = boundsToWidthHeight(this.root, bounds);
        this._element.style.width = `${width}px`;
        this._element.style.height = `${height}px`;
    }

    protected _onUpdate(props: Partial<ImageOverlayProps>): void {
        if (props.bounds) {
            this._feature.update({
                geometry: boundsToLeftUpperPoint(props.bounds)
            });
            // Recalculate sizes when bounds change
            this._updateSize();
        }
        if (props.image) {
            this._element.style.backgroundImage = `url(${props.image})`;
        }
        if (props.className) {
            this._element.className = `element ${props.className}`;
        }
    }

    protected _onDetach(): void {
        this.removeChild(this._listener);
        this.removeChild(this._feature);
    }
}
