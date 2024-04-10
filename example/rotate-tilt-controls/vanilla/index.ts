import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    // Waiting for all api elements to be loaded
    await ymaps3.ready;
    const {YMap, YMapControls, YMapDefaultSchemeLayer} = ymaps3;
    const {YMapRotateTiltControl, YMapTiltControl, YMapRotateControl} = await ymaps3.import(
        '@yandex/ymaps3-default-ui-theme'
    );
    // Initialize the map
    map = new YMap(
        // Pass the link to the HTMLElement of the container
        document.getElementById('app'),
        // Pass the map initialization parameters
        {location: LOCATION, showScaleInCopyrights: true, behaviors: ENABLED_BEHAVIORS},
        // Add a map scheme layer
        [new YMapDefaultSchemeLayer({})]
    );

    map.addChild(
        new YMapControls({position: 'right'}, [
            new YMapRotateTiltControl({}),
            new YMapRotateControl({}),
            new YMapTiltControl({})
        ])
    );
}
