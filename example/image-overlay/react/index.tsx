import {LOCATION, RECTANGLE_COORDINATES, IMAGE_RELATIVE_PATH} from '../variables';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = reactify.module(ymaps3);

    const {useState} = React;

    const {YMapImageOverlay} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);

        return (
            <YMap location={location} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapImageOverlay
                    className="image-overlay"
                    image={IMAGE_RELATIVE_PATH}
                    bounds={RECTANGLE_COORDINATES}
                />
            </YMap>
        );
    }
}
