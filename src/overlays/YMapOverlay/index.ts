import type {YMapFeature, YMapListener, LngLatBounds} from '@yandex/ymaps3-types';
import {leftUpperPointToPointGeometry, boundsToWidthHeight} from '../common';
import {YMapOverlayReactifyOverride} from './react';
import {YMapOverlayVuefyOptions, YMapOverlayVuefyOverride} from './vue';

export type YMapOverlayProps = {
    bounds: LngLatBounds;
    htmlElement: HTMLElement;
};

export class YMapOverlay extends ymaps3.YMapComplexEntity<YMapOverlayProps> {
    static [ymaps3.overrideKeyReactify] = YMapOverlayReactifyOverride;
    static [ymaps3.overrideKeyVuefy] = YMapOverlayVuefyOverride;
    static [ymaps3.optionsKeyVuefy] = YMapOverlayVuefyOptions;

    private _htmlElement: HTMLElement;
    private _feature: YMapFeature;
    private _listener: YMapListener;

    constructor(props: YMapOverlayProps) {
        super(props);
        const {bounds, htmlElement} = this._props;
        this._htmlElement = htmlElement;
        this._feature = new ymaps3.YMapFeature({
            geometry: leftUpperPointToPointGeometry(bounds),
            style: {
                element: this._htmlElement
            }
        });
        this._listener = new ymaps3.YMapListener({
            onUpdate: () => this._updateSize()
        });

        this.addChild(this._feature);
        this.addChild(this._listener);
    }

    protected _onAttach(): void {
        this._updateSize();
    }

    private _updateSize(): void {
        const {bounds} = this._props;
        const {width, height} = boundsToWidthHeight(this.root, bounds);

        // Apply size to container
        Object.assign(this._htmlElement.style, {
            width: `${width}px`,
            height: `${height}px`
        });

        // Apply size to all direct children (for React portal content)
        Array.from(this._htmlElement.children).forEach((child: HTMLElement) => {
            Object.assign(child.style, {
                width: `${width}px`,
                height: `${height}px`
            });
        });
    }

    protected _onUpdate({bounds, htmlElement}: Partial<YMapOverlayProps>): void {
        if (bounds) {
            this._feature.update({
                geometry: leftUpperPointToPointGeometry(bounds)
            });
            // Recalculate sizes when bounds change
            this._updateSize();
        }

        if (htmlElement !== undefined) {
            this._htmlElement = htmlElement;
        }
    }
}
