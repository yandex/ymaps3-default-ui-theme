import {AvailableTypes} from '.';
import changeOrderSVG from './icons/change-order.svg';
import drivingSVG from './icons/driving.svg';
import errorIconSVG from './icons/error-icon.svg';
import loadingSpinnerSVG from './icons/loading-spinner.svg';
import transitSVG from './icons/transit.svg';
import truckSVG from './icons/truck.svg';
import walkingSVG from './icons/walking.svg';

const svgIcons: Record<AvailableTypes, string> = {
    driving: drivingSVG,
    truck: truckSVG,
    walking: walkingSVG,
    transit: transitSVG
};

const ALLOWED_TYPES: AvailableTypes[] = ['driving', 'truck', 'walking', 'transit'];

export function createSegmentedControl(availableTypes: AvailableTypes[]): HTMLElement {
    const element = document.createElement('ymaps3');
    element.classList.add('ymaps3--route-control_modes');

    const container = document.createElement('ymaps3');
    container.classList.add('ymaps3--route-control_modes__container');
    element.appendChild(container);

    if (availableTypes.length < 1) {
        throw new Error('The route must contain at least one type of route.');
    }

    const options: {option: HTMLInputElement; label: HTMLLabelElement}[] = [];
    availableTypes.forEach((routeType) => {
        if (!ALLOWED_TYPES.includes(routeType)) {
            return;
        }
        const option = document.createElement('input');
        const label = document.createElement('label');

        option.type = 'radio';
        option.id = routeType;
        option.value = routeType;
        label.htmlFor = routeType;
        label.insertAdjacentHTML('afterbegin', svgIcons[routeType]);
        option.name = 'route-mode';
        options.push({option, label});
    });

    options[0].option.checked = true;

    options.forEach(({option, label}) => {
        container.appendChild(option);
        container.appendChild(label);
    });

    return element;
}

export function createActionsContainer(options: {clearFieldsText: string; changeOrderText: string}) {
    const container = document.createElement('ymaps3');
    container.classList.add('ymaps3--route-control_actions');

    const changeOrderButton = document.createElement('button');
    changeOrderButton.insertAdjacentHTML('afterbegin', changeOrderSVG);
    const changeOrderButtonLabel = document.createElement('span');
    changeOrderButtonLabel.textContent = options.changeOrderText;
    changeOrderButton.appendChild(changeOrderButtonLabel);

    const clearFieldsButton = document.createElement('button');
    clearFieldsButton.textContent = options.clearFieldsText;

    container.appendChild(changeOrderButton);
    container.appendChild(clearFieldsButton);

    return {container, changeOrderButton, clearFieldsButton};
}

export function createLoadingSpinner(): HTMLElement {
    const containerElement = document.createElement('ymaps3');
    containerElement.classList.add('ymaps3--route-control_info_loading');
    containerElement.insertAdjacentHTML('afterbegin', loadingSpinnerSVG);
    return containerElement;
}

export function createInfoElementComponent(type: 'time' | 'distance', value: string): HTMLElement {
    const containerElement = document.createElement('ymaps3');
    containerElement.classList.add('ymaps3--route-control_info_container');

    const labelEl = document.createElement('ymaps3');
    labelEl.classList.add('ymaps3--route-control_info_container__label');
    labelEl.textContent = type === 'time' ? 'Время в пути' : 'Расстояние';

    const valueEl = document.createElement('ymaps3');
    valueEl.classList.add('ymaps3--route-control_info_container__value');
    valueEl.textContent = value;

    containerElement.replaceChildren(labelEl, valueEl);

    return containerElement;
}

export function createRouteNoBuildError(): HTMLElement[] {
    const errorIcon = document.createElement('ymaps3');
    errorIcon.classList.add('ymaps3--route-control_info_error__icon');
    errorIcon.insertAdjacentHTML('afterbegin', errorIconSVG);

    const textContainer = document.createElement('ymaps3');
    textContainer.classList.add('ymaps3--route-control_info_error__text-container');

    const labelElement = document.createElement('ymaps3');
    labelElement.classList.add('ymaps3--route-control_info_error__label');
    labelElement.textContent = 'Невозможно построить маршрут';

    const descriptionElement = document.createElement('ymaps3');
    descriptionElement.classList.add('ymaps3--route-control_info_error__description');
    descriptionElement.textContent = 'Проверьте места начальной и конечной точек, а так же наличие дорог между';

    textContainer.replaceChildren(labelElement, descriptionElement);

    return [errorIcon, textContainer];
}

export function createRouteServerError(onClick: () => void): HTMLElement[] {
    const errorIcon = document.createElement('ymaps3');
    errorIcon.classList.add('ymaps3--route-control_info_error__icon');
    errorIcon.insertAdjacentHTML('afterbegin', errorIconSVG);

    const labelElement = document.createElement('ymaps3');
    labelElement.classList.add('ymaps3--route-control_info_error__label');
    labelElement.textContent = 'Ошибка сервера';

    const buttonElement = document.createElement('button');
    buttonElement.classList.add('ymaps3--route-control_info_error__button');
    buttonElement.textContent = 'Повторить построение';
    buttonElement.addEventListener('click', onClick);

    return [errorIcon, labelElement, buttonElement];
}
