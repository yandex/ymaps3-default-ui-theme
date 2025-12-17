import {LOCATION, OVERLAY_BOUNDS, ZOOM_RANGE, IFRAME_ATTRIBUTES} from '../variables.js';

window.map = null;

main();

async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = reactify.module(ymaps3);
    const {useState} = React;
    const {YMapOverlay} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);

        return (
            <YMap location={location} showScaleInCopyrights={true} zoomRange={ZOOM_RANGE} ref={(x: any) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapOverlay bounds={OVERLAY_BOUNDS}>
                    <iframe {...IFRAME_ATTRIBUTES} />
                </YMapOverlay>
            </YMap>
        );
    }
}
