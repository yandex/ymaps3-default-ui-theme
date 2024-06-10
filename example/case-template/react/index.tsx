import {CENTER, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = reactify.module(ymaps3);

    const {YMapDefaultMarker, YMapZoomControl} = reactify.module(
        await ymaps3.import('@yandex/ymaps3-default-ui-theme')
    );

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        return (
            <YMap location={LOCATION} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="right">
                    <YMapZoomControl />
                </YMapControls>
                <YMapDefaultMarker coordinates={CENTER} size="normal" iconName="fallback" />
            </YMap>
        );
    }
}
