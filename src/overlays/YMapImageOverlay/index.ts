import type {YMapFeature, YMapListener, LngLatBounds, YMapFeatureProps} from '@yandex/ymaps3-types';
import {leftUpperPointToPointGeometry, boundsToWidthHeight} from './common';
import './index.css';

export type ImageOverlayProps = {
    bounds: LngLatBounds;
    image: string;
    className?: string;
} & Omit<YMapFeatureProps, 'geometry'>;

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
            geometry: leftUpperPointToPointGeometry(props.bounds),
            style: {
                element: this._element
            }
        });

        this._listener = new ymaps3.YMapListener({
            onUpdate: () => this._updateSize()
        });

        this.addChild(this._feature);
        this.addChild(this._listener);
    }

    protected _onAttach(): void {
        const {bounds, image} = this._props;

        const {width, height} = boundsToWidthHeight(this.root, bounds);

        Object.assign(this._element.style, {
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage: `url(${image})`
        });
    }

    private _updateSize(): void {
        const {bounds} = this._props;
        const {width, height} = boundsToWidthHeight(this.root, bounds);
        Object.assign(this._element.style, {
            width: `${width}px`,
            height: `${height}px`
        });
    }

    protected _onUpdate(props: Partial<ImageOverlayProps>): void {
        if (props.bounds) {
            this._feature.update({
                geometry: leftUpperPointToPointGeometry(props.bounds)
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
}
