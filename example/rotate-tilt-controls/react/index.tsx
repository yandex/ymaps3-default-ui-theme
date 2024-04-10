import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    // For each object in the JS API, there is a React counterpart
    // To use the React version of the API, include the module @yandex/ymaps3-reactify
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
    const {YMap, YMapControls, YMapDefaultSchemeLayer} = reactify.module(ymaps3);
    const {YMapRotateTiltControl, YMapTiltControl, YMapRotateControl} = reactify.module(
        await ymaps3.import('@yandex/ymaps3-default-ui-theme')
    );
    const {useState} = React;

    function App() {
        const [location] = useState(LOCATION);

        return (
            // Initialize the map and pass initialization parameters
            <YMap location={location} behaviors={ENABLED_BEHAVIORS} showScaleInCopyrights={true} ref={(x) => (map = x)}>
                {/* Add a map scheme layer */}
                <YMapDefaultSchemeLayer />
                <YMapControls position="right">
                    <YMapRotateTiltControl />
                    <YMapRotateControl />
                    <YMapTiltControl />
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
