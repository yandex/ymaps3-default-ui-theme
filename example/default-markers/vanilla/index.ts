import {LOCATION, MARKER_LOCATIONS} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} = ymaps3;

    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

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

    MARKER_LOCATIONS.forEach((props) => map.addChild(new YMapDefaultMarker(props)));
}
