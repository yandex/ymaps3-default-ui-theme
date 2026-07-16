import {ENABLED_BEHAVIORS, LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} = ymaps3;

    const {YMapGeolocationControl, YMapRotateControl, YMapRotateTiltControl, YMapTiltControl, YMapZoomControl} =
        await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(
        document.getElementById('app'),
        {location: LOCATION, showScaleInCopyrights: true, behaviors: ENABLED_BEHAVIORS, theme: 'dark'},
        [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})]
    );

    map.addChild(
        new YMapControls({position: 'top right'}).addChild(
            new YMapControlButton({
                text: 'Switch theme',
                onClick: () => {
                    const {theme} = map;
                    map.update({theme: theme === 'light' ? 'dark' : 'light'});
                }
            })
        )
    );

    map.addChild(
        new YMapControls({position: 'left'}, [new YMapZoomControl({}), new YMapGeolocationControl({zoom: 11})])
    );
    map.addChild(new YMapControls({position: 'bottom'}, [new YMapZoomControl({})]));
    map.addChild(
        new YMapControls({position: 'right'}, [
            new YMapRotateTiltControl({}),
            new YMapRotateControl({}),
            new YMapTiltControl({})
        ])
    );
}
