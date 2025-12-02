import {LOCATION, IMAGE_BOUNDS, IMAGE_RELATIVE_PATH} from '../variables';
window.map = null;

main();
async function main() {
    // Waiting for all api elements to be loaded
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;

    const {YMapImageOverlay} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    // Initialize the map
    map = new YMap(
        // Pass the link to the HTMLElement of the container
        document.getElementById('app'),
        // Pass the map initialization parameters
        {location: LOCATION, showScaleInCopyrights: true},
        [
            // Add a map scheme layer
            new YMapDefaultSchemeLayer({}),
            // Add a layer of geo objects to display the polygons
            new YMapDefaultFeaturesLayer({})
        ]
    );

    const imageOverlay = new YMapImageOverlay({
        bounds: IMAGE_BOUNDS,
        imageUrl: IMAGE_RELATIVE_PATH,
        className: 'image-overlay'
    });

    map.addChild(imageOverlay);
}
