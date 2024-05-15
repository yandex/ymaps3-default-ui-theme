import {CENTER, LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} = ymaps3;

    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    const marker = new YMapDefaultMarker({
        coordinates: CENTER,
        iconName: 'fallback',
        size: 'normal',
        popup: {
            content: () => {
                const popup = document.createElement('span');
                popup.textContent = 'Marker popup';
                return popup;
            }
        }
    });

    map.addChild(marker);

    map.addChild(
        new YMapControls({position: 'top left'}, [
            new YMapControlButton({text: 'Normal', onClick: () => marker.update({size: 'normal'})}),
            new YMapControlButton({text: 'Small', onClick: () => marker.update({size: 'small'})}),
            new YMapControlButton({text: 'Micro', onClick: () => marker.update({size: 'micro'})})
        ])
    );
}
