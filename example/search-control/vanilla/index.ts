import type {SearchResponse} from '@yandex/ymaps3-types';
import {LOCATION, MARGIN, initialMarkerProps, findSearchResultBoundsRange} from '../common';

window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = ymaps3;

    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
    const {YMapSearchControl} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(document.getElementById('app'), {location: LOCATION, margin: MARGIN});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    const initialMarker = new YMapDefaultMarker({
        title: initialMarkerProps.properties.name,
        subtitle: initialMarkerProps.properties.description,
        coordinates: initialMarkerProps.geometry.coordinates,
        size: 'normal',
        iconName: 'fallback',
        onClick: () => {
            map.removeChild(initialMarker);
        }
    });
    map.addChild(initialMarker);
    const searchMarkers = [initialMarker];

    const updateSearchMarkers = (searchResult: SearchResponse) => {
        searchMarkers.forEach((marker) => {
            map.removeChild(marker);
        });

        searchResult.forEach((element) => {
            const marker = new YMapDefaultMarker({
                title: element.properties.name,
                subtitle: element.properties?.description,
                coordinates: element.geometry.coordinates,
                size: 'normal',
                iconName: 'fallback',
                onClick: () => {
                    map.removeChild(marker);
                }
            });
            map.addChild(marker);
            searchMarkers.push(marker);
        });
    };

    const updateMapLocation = (searchResult: SearchResponse) => {
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

            map.update({
                location: {
                    center,
                    zoom,
                    bounds,
                    duration: 400
                }
            });
        }
    };

    const searchResultHandler = (searchResult: SearchResponse) => {
        updateSearchMarkers(searchResult);
        updateMapLocation(searchResult);
    };

    map.addChild(
        new YMapControls({position: 'top'}).addChild(
            new YMapSearchControl({
                searchResult: searchResultHandler
            })
        )
    );
}
