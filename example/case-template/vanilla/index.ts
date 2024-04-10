import {LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = ymaps3;

    const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
    const {YMapButtonExample} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    map.addChild(
        new YMapControls({position: 'right'})
            .addChild(new YMapZoomControl({}))
            .addChild(new YMapButtonExample({text: 'My button', onClick: () => alert('Click!')}))
    );
}
