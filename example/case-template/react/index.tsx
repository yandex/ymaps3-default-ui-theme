import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = reactify.module(ymaps3);

    const {useState, useCallback} = React;

    const {YMapZoomControl} = reactify.module(await ymaps3.import('@yandex/ymaps3-controls@0.0.1'));

    const {YMapButtonExample} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location, setLocation] = useState(LOCATION);
        const onClick = useCallback(() => alert('Click!'), []);

        return (
            <YMap location={location} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="right">
                    <YMapZoomControl />
                    <YMapButtonExample text={'My button'} onClick={onClick} />
                </YMapControls>
            </YMap>
        );
    }
}
