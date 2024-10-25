import {ENABLED_BEHAVIORS, LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = reactify.module(ymaps3);

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

        return (
            <YMap location={location} behaviors={behaviors} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
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
