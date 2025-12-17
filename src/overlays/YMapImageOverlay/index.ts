import type {LngLatBounds} from '@yandex/ymaps3-types';
import './index.css';
import {YMapOverlay, YMapOverlayProps} from '../index';

const IMAGE_OVERLAY = 'ymaps3--image-overlay';

export type YMapImageOverlayProps = {
    bounds: LngLatBounds;
    imageUrl: string;
    className?: string;
};

export class YMapImageOverlay extends ymaps3.YMapComplexEntity<YMapImageOverlayProps> {
    private _overlay: YMapOverlay;
    private _element: HTMLElement;

    constructor(props: YMapImageOverlayProps) {
        super(props);

        // Create HTML element for the image
        this._element = document.createElement('div');
        this._element.className = `${IMAGE_OVERLAY} ${props.className ?? ''}`;
        this._element.style.backgroundImage = `url(${props.imageUrl})`;

        // Use YMapOverlay as a child component
        this._overlay = new YMapOverlay({
            bounds: props.bounds,
            htmlElement: this._element
        });

        this.addChild(this._overlay);
    }

    protected _onUpdate(props: Partial<YMapImageOverlayProps>): void {
        if (props.bounds) {
            this._overlay.update({bounds: props.bounds});
        }
        if (props.imageUrl) {
            this._element.style.backgroundImage = `url(${props.imageUrl})`;
        }
        if (props.className) {
            this._element.className = `${IMAGE_OVERLAY} ${props.className}`;
        }
    }
}
