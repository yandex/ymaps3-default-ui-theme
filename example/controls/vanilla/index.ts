import {ENABLED_BEHAVIORS, LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = ymaps3;

    const {YMapGeolocationControl, YMapRotateControl, YMapRotateTiltControl, YMapTiltControl, YMapZoomControl} =
        await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(
        document.getElementById('app'),
        {location: LOCATION, showScaleInCopyrights: true, behaviors: ENABLED_BEHAVIORS},
        [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})]
    );

    map.addChild(new YMapControls({position: 'left'}, [new YMapZoomControl({}), new YMapGeolocationControl({})]));
    map.addChild(new YMapControls({position: 'bottom'}, [new YMapZoomControl({})]));
    map.addChild(
        new YMapControls({position: 'right'}, [
            new YMapRotateTiltControl({}),
            new YMapRotateControl({}),
            new YMapTiltControl({})
        ])
    );
}
