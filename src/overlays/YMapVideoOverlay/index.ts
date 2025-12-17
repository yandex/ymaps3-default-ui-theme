import type {LngLatBounds} from '@yandex/ymaps3-types';
import './index.css';
import {YMapOverlay} from '../index';

const VIDEO_OVERLAY_CLASSNAME = 'ymaps3--video-overlay';

/** Attributes for the video element */
export type VideoAttributes = {
    /** Autoplay video */
    autoplay?: boolean;
    /** Loop video playback */
    loop?: boolean;
    /** Mute audio */
    muted?: boolean;
    /** Show video controls */
    controls?: boolean;
    /** Play inline (important for iOS) */
    playsInline?: boolean;
    /** Video preload: 'none' | 'metadata' | 'auto' */
    preload?: 'none' | 'metadata' | 'auto';
    /** Poster image URL */
    poster?: string;
    /** CORS policy: 'anonymous' | 'use-credentials' */
    crossOrigin?: 'anonymous' | 'use-credentials';
    /** Volume (0.0 - 1.0) */
    volume?: number;
    /** Playback rate */
    playbackRate?: number;
    /** Default muted state */
    defaultMuted?: boolean;
    /** Default playback rate */
    defaultPlaybackRate?: number;
};

export type YMapVideoOverlayProps = {
    bounds: LngLatBounds;
    /** Path to video file or video URL */
    videoUrl: string;
    /** Attributes for the video element */
    videoAttributes?: VideoAttributes;
    className?: string;
};

const defaultProps = Object.freeze({
    videoAttributes: {controls: true, preload: 'metadata', playsInline: true}
});
type defaultProps = typeof defaultProps;

export class YMapVideoOverlay extends ymaps3.YMapComplexEntity<YMapVideoOverlayProps, defaultProps> {
    static defaultProps = defaultProps;
    private _overlay: YMapOverlay;
    private _videoElement: HTMLVideoElement;

    constructor(props: YMapVideoOverlayProps) {
        super(props);
        const {bounds, videoUrl, videoAttributes} = this._props;

        // Create video element
        this._videoElement = document.createElement('video');
        this._videoElement.className = `${VIDEO_OVERLAY_CLASSNAME} ${props.className ?? ''}`;

        // Apply default attributes and user attributes
        Object.assign(this._videoElement, {
            src: videoUrl,
            ...videoAttributes
        });

        // Use YMapOverlay as a child component
        this._overlay = new YMapOverlay({
            bounds: bounds,
            htmlElement: this._videoElement
        });

        this.addChild(this._overlay);
    }

    protected _onUpdate({bounds, videoUrl, videoAttributes, className}: Partial<YMapVideoOverlayProps>): void {
        if (bounds) {
            this._overlay.update({bounds});
        }

        if (videoUrl !== undefined) {
            this._videoElement.src = videoUrl;
        }

        if (videoAttributes !== undefined) {
            Object.assign(this._videoElement, videoAttributes);
        }

        if (className !== undefined) {
            this._videoElement.className = `${VIDEO_OVERLAY_CLASSNAME} ${className}`;
        }
    }
}
