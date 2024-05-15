import {LOCATION, MARKER_LOCATIONS} from '../common';
import {YMapTheme} from '@yandex/ymaps3-types';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} =
        reactify.module(ymaps3);

    const {useState, useCallback} = React;

    const {YMapDefaultMarker} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location] = useState(LOCATION);
        const [theme, setTheme] = useState<YMapTheme>('light');

        const switchTheme = useCallback(() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
        }, [theme]);

        return (
            <YMap location={location} theme={theme} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top right">
                    <YMapControlButton text="Switch theme" onClick={switchTheme} />
                </YMapControls>
                {MARKER_LOCATIONS.map((props, i) => (
                    <YMapDefaultMarker {...props} key={i} />
                ))}
            </YMap>
        );
    }
}
