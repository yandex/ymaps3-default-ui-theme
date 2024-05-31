import type {SearchResponse, Feature} from '@yandex/ymaps3-types';
import {LOCATION, MARGIN, initialMarkerProps, findSearchResultBoundsRange} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {useState, useCallback} = React;

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = reactify.module(ymaps3);

    const {YMapDefaultMarker} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));
    const {YMapSearchControl} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [location, setLocation] = useState(LOCATION);
        const [searchMarkersProps, setSearchMarkersProps] = useState([initialMarkerProps]);

        const updateMapLocation = useCallback((searchResult: SearchResponse) => {
            if (searchResult.length !== 0) {
                let center;
                let zoom;
                let bounds;

                if (searchResult.length === 1) {
                    center = searchResult[0].geometry?.coordinates;
                    zoom = 12;
                } else {
                    bounds = findSearchResultBoundsRange(searchResult);
                }

                setLocation({
                    center,
                    zoom,
                    bounds,
                    duration: 400
                });
            }
        }, []);

        const searchResultHandler = useCallback((searchResult: SearchResponse) => {
            setSearchMarkersProps(searchResult);
            updateMapLocation(searchResult);
        }, []);

        const onClickSearchMarkerHandler = useCallback(
            (clickedMarker: Feature) => {
                setSearchMarkersProps(searchMarkersProps.filter((marker) => marker !== clickedMarker));
            },
            [searchMarkersProps]
        );

        return (
            <YMap location={location} margin={MARGIN} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top">
                    <YMapSearchControl searchResult={searchResultHandler} />
                </YMapControls>

                {searchMarkersProps.map((marker) => (
                    <YMapDefaultMarker
                        key={+marker.geometry.coordinates}
                        title={marker.properties.name}
                        subtitle={marker.properties.description}
                        coordinates={marker.geometry.coordinates}
                        onClick={() => onClickSearchMarkerHandler(marker)}
                        size="normal"
                        iconName="fallback"
                    />
                ))}
            </YMap>
        );
    }
}
