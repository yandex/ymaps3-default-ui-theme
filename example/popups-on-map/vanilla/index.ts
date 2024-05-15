import type {YMapPopupPositionProps} from '../../src';
import {ACTION, CUSTOM_POPUP_COORDS, DESCRIPTION, LOCATION, POPUP_TEXT, TEXT_POPUP_COORDS, TITLE} from '../common';

window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapControlButton} = ymaps3;

    const {YMapPopupMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    const updatePositions = (position: YMapPopupPositionProps) => {
        textPopup.update({position});
        customPopup.update({position});
    };

    map.addChild(
        new YMapControls({position: 'top right'}, [
            new YMapControlButton({text: 'Left', onClick: () => updatePositions('left')}),
            new YMapControlButton({text: 'Left Top', onClick: () => updatePositions('left top')}),
            new YMapControlButton({text: 'Left Bottom', onClick: () => updatePositions('left bottom')}),
            new YMapControlButton({text: 'Bottom', onClick: () => updatePositions('bottom')}),
            new YMapControlButton({text: 'Top', onClick: () => updatePositions('top')}),
            new YMapControlButton({text: 'Right Top', onClick: () => updatePositions('right top')}),
            new YMapControlButton({text: 'Right Bottom', onClick: () => updatePositions('right bottom')}),
            new YMapControlButton({text: 'Right', onClick: () => updatePositions('right')})
        ])
    );

    const textPopup = new YMapPopupMarker({coordinates: TEXT_POPUP_COORDS, draggable: true, content: POPUP_TEXT});
    map.addChild(textPopup);

    const customPopup = new YMapPopupMarker({
        coordinates: CUSTOM_POPUP_COORDS,
        draggable: true,
        content: createDefaultPopup
    });
    map.addChild(customPopup);

    function createDefaultPopup(): HTMLElement {
        const popupRootElement = document.createElement('span');
        popupRootElement.classList.add('popup');

        const popupHeaderElement = document.createElement('span');
        popupHeaderElement.classList.add('header');
        popupRootElement.appendChild(popupHeaderElement);

        const titleElement = document.createElement('span');
        titleElement.classList.add('header_title');
        titleElement.textContent = TITLE;
        popupHeaderElement.appendChild(titleElement);

        const closeButton = document.createElement('button');
        closeButton.classList.add('header_close');
        closeButton.addEventListener('click', () => {
            customPopup.update({show: false});
        });
        popupHeaderElement.appendChild(closeButton);

        const descriptionElement = document.createElement('span');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = DESCRIPTION;
        popupRootElement.appendChild(descriptionElement);

        const actionButton = document.createElement('button');
        actionButton.classList.add('action');
        actionButton.textContent = ACTION;
        actionButton.addEventListener('click', () => {
            alert('Click on action button!');
        });
        popupRootElement.appendChild(actionButton);

        return popupRootElement;
    }
}
