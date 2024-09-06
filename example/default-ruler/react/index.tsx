import {RulerType} from '@yandex/ymaps3-types/modules/ruler';
import {LOCATION, RULER_COORDINATES} from '../common';

window.map = null;

main();
async function main() {
    // For each object in the JS API, there is a React counterpart
    // To use the React version of the API, include the module @yandex/ymaps3-reactify
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
    const {YMap, YMapDefaultSchemeLayer, YMapControls, YMapControlButton} = reactify.module(ymaps3);
    const {YMapDefaultRuler} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));
    const {useState, useCallback} = React;

    function App() {
        const [location] = useState(LOCATION);
        const [rulerCoordinates] = useState(RULER_COORDINATES);
        const [rulerType, setRulerType] = useState<RulerType>('ruler');
        const [editable, setEditable] = useState(true);

        const switchEditable = useCallback(() => setEditable((editable) => !editable), []);
        const switchType = useCallback(
            () => setRulerType((rulerType) => (rulerType === 'ruler' ? 'planimeter' : 'ruler')),
            []
        );
        const onFinish = useCallback(() => setEditable(false), []);

        return (
            // Initialize the map and pass initialization parameters
            <YMap location={location} showScaleInCopyrights={true} ref={(x) => (map = x)}>
                {/* Add a map scheme layer */}
                <YMapDefaultSchemeLayer />
                <YMapDefaultRuler type={rulerType} points={rulerCoordinates} editable={editable} onFinish={onFinish} />

                <YMapControls position="top right">
                    <YMapControlButton onClick={switchEditable} text="Switch edit ruler" />
                </YMapControls>
                <YMapControls position="top left">
                    <YMapControlButton onClick={switchType} text="Switch ruler type" />
                </YMapControls>
            </YMap>
        );
    }

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );
}
