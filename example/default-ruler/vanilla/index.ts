import {RulerType} from '@yandex/ymaps3-types/modules/ruler';
import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

main();
async function main() {
    // Waiting for all api elements to be loaded
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapControlButton, YMapControls} = ymaps3;
    const {YMapDefaultRuler} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
    // Initialize the map
    map = new YMap(
        // Pass the link to the HTMLElement of the container
        document.getElementById('app'),
        // Pass the map initialization parameters
        {location: LOCATION, showScaleInCopyrights: true},
        // Add a map scheme layer
        [new YMapDefaultSchemeLayer({})]
    );

    let editable = true;
    let rulerType: RulerType = 'ruler';

    const ruler = new YMapDefaultRuler({
        type: rulerType,
        editable,
        points: RULER_COORDINATES,
        onFinish: () => {
            editable = false;
        }
    });
    map.addChild(ruler);

    map.addChild(
        new YMapControls({position: 'top right'}, [
            new YMapControlButton({
                text: 'Switch edit ruler',
                onClick: () => {
                    editable = !editable;
                    ruler.update({editable});
                }
            })
        ])
    );
    map.addChild(
        new YMapControls({position: 'top left'}, [
            new YMapControlButton({
                text: 'Switch ruler type',
                onClick: () => {
                    rulerType = rulerType === 'ruler' ? 'planimeter' : 'ruler';
                    ruler.update({type: rulerType});
                }
            })
        ])
    );
}
