import {YMapTheme} from '@yandex/ymaps3-types';
import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} =
        reactify.module(ymaps3);

    const {useState, useCallback} = React;

    const {YMapGeolocationControl, YMapRotateControl, YMapRotateTiltControl, YMapTiltControl, YMapZoomControl} =
        reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const location = React.useMemo(() => LOCATION, []);
        const behaviors = React.useMemo(() => ENABLED_BEHAVIORS, []);
        const [theme, setTheme] = useState<YMapTheme>('dark');

        const switchTheme = useCallback(() => {
            setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
        }, []);

        return (
            <YMap location={location} behaviors={behaviors} theme={theme} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top right">
                    <YMapControlButton text="Switch theme" onClick={switchTheme} />
                </YMapControls>
                <YMapControls position="left">
                    <YMapZoomControl />
                    <YMapGeolocationControl zoom={11} />
                </YMapControls>
                <YMapControls position="bottom">
                    <YMapZoomControl />
                </YMapControls>
                <YMapControls position="right">
                    <YMapRotateTiltControl />
                    <YMapRotateControl />
                    <YMapTiltControl />
                </YMapControls>
            </YMap>
        );
    }
}
