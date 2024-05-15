import type {YMapPopupPositionProps} from '../../src';
import {ACTION, CUSTOM_POPUP_COORDS, DESCRIPTION, LOCATION, POPUP_TEXT, TEXT_POPUP_COORDS, TITLE} from '../common';
window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} =
        reactify.module(ymaps3);

    const {useState, useCallback} = React;

    const {YMapPopupMarker} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );

    function App() {
        const [position, setPosition] = useState<YMapPopupPositionProps>(undefined);
        const [showCustom, setShowCustom] = useState(true);

        const positionLeft = useCallback(() => setPosition('left'), []);
        const positionLeftTop = useCallback(() => setPosition('left top'), []);
        const positionLeftBottom = useCallback(() => setPosition('left bottom'), []);
        const positionBottom = useCallback(() => setPosition('bottom'), []);
        const positionTop = useCallback(() => setPosition('top'), []);
        const positionRightTop = useCallback(() => setPosition('right top'), []);
        const positionRightBottom = useCallback(() => setPosition('right bottom'), []);
        const positionRight = useCallback(() => setPosition('right'), []);

        const customPopupContent = useCallback(
            () => (
                <span className="popup">
                    <span className="header">
                        <span className="header_title">{TITLE}</span>
                        <button className="header_close" onClick={() => setShowCustom(false)}></button>
                    </span>
                    <span className="description">{DESCRIPTION}</span>
                    <button className="action" onClick={() => alert('Click on action button!')}>
                        {ACTION}
                    </button>
                </span>
            ),
            []
        );

        return (
            <YMap location={LOCATION} ref={(x) => (map = x)}>
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapControls position="top right">
                    <YMapControlButton text="Left" onClick={positionLeft} />
                    <YMapControlButton text="Left Top" onClick={positionLeftTop} />
                    <YMapControlButton text="Left Bottom" onClick={positionLeftBottom} />
                    <YMapControlButton text="Bottom" onClick={positionBottom} />
                    <YMapControlButton text="Top" onClick={positionTop} />
                    <YMapControlButton text="Right Top" onClick={positionRightTop} />
                    <YMapControlButton text="Right Bottom" onClick={positionRightBottom} />
                    <YMapControlButton text="Right" onClick={positionRight} />
                </YMapControls>
                <YMapPopupMarker coordinates={TEXT_POPUP_COORDS} draggable position={position} content={POPUP_TEXT} />
                <YMapPopupMarker
                    coordinates={CUSTOM_POPUP_COORDS}
                    draggable
                    position={position}
                    show={showCustom}
                    content={customPopupContent}
                />
            </YMap>
        );
    }
}
