import {LOCATION, OVERLAY_BOUNDS, ZOOM_RANGE, IFRAME_ATTRIBUTES} from '../variables.js';

window.map = null;

main();

async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;
    const {YMapOverlay} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(
        document.getElementById('app'),
        {location: LOCATION, showScaleInCopyrights: true, zoomRange: ZOOM_RANGE},
        [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})]
    );

    const iframe = document.createElement('iframe');
    Object.assign(iframe, IFRAME_ATTRIBUTES);

    const overlay = new YMapOverlay({
        bounds: OVERLAY_BOUNDS,
        htmlElement: iframe
    });

    map.addChild(overlay);
}
