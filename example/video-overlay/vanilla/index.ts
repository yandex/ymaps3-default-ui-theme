import {LOCATION, VIDEO_ATTRIBUTES, VIDEO_BOUNDS, VIDEO_URL, ZOOM_RANGE} from '../variables.js';
window.map = null;

main();
async function main() {
    // Waiting for all api elements to be loaded
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;

    const {YMapVideoOverlay} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    // Initialize the map
    map = new YMap(
        // Pass the link to the HTMLElement of the container
        document.getElementById('app'),
        // Pass the map initialization parameters
        {location: LOCATION, showScaleInCopyrights: true, zoomRange: ZOOM_RANGE},
        [
            // Add a map scheme layer
            new YMapDefaultSchemeLayer({}),
            // Add a layer of geo objects to display the polygons
            new YMapDefaultFeaturesLayer({})
        ]
    );

    // Video overlay example
    const videoOverlay = new YMapVideoOverlay({
        bounds: VIDEO_BOUNDS,
        videoUrl: VIDEO_URL,
        videoAttributes: VIDEO_ATTRIBUTES,
        className: 'video-overlay'
    });

    map.addChild(videoOverlay);
}
