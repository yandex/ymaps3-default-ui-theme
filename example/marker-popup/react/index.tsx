import {MarkerSizeProps} from '../../src';
import {CENTER, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} =
        reactify.module(ymaps3);

    const {useState, useCallback, useMemo} = React;

    const {YMapDefaultMarker} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);
        const [size, setSize] = useState<MarkerSizeProps>('normal');
        const popup = useMemo(() => ({content: () => <span>Marker popup</span>}), []);

        return (
            <YMap location={location} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />

                <YMapDefaultMarker coordinates={CENTER} iconName="fallback" size={size} popup={popup} />

                <YMapControls position="top left">
                    <YMapControlButton text="Normal" onClick={useCallback(() => setSize('normal'), [])} />
                    <YMapControlButton text="Small" onClick={useCallback(() => setSize('small'), [])} />
                    <YMapControlButton text="Micro" onClick={useCallback(() => setSize('micro'), [])} />
                </YMapControls>
            </YMap>
        );
    }
}
