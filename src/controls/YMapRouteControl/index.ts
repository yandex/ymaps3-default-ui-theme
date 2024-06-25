import {
    BaseRouteResponse,
    DomDetach,
    Feature,
    LngLat,
    YMap,
    YMapControl,
    SearchResponse,
    SuggestResponse
} from '@yandex/ymaps3-types';
import {RouteOptions, TruckParameters} from '@yandex/ymaps3-types/imperative/route';
import {CustomSearch, CustomSuggest} from '../YMapSearchControl';
import {YMapWaypointInput, YMapWaypointInputProps, SelectWaypointArgs} from './YMapWaypointInput';
import {
    createActionsContainer,
    createInfoElementComponent,
    createLoadingSpinner,
    createRouteNoBuildError,
    createRouteServerError,
    createSegmentedControl
} from './helpers';
import './index.css';
import {formatDistance, formatDuration} from './utils';

export type WaypointsArray = Array<SelectWaypointArgs['feature'] | null>;

export type AvailableTypes = RouteOptions['type'];

export type CustomRoute = {
    params: RouteOptions;
    map: YMap;
};

export type YMapRouteControlProps = {
    geolocationTextInput?: string;
    clearFieldsText?: string;
    changeOrderText?: string;
    availableTypes?: AvailableTypes[];
    truckParameters?: TruckParameters;
    waypoints?: [LngLat | null, LngLat | null];
    waypointsPlaceholders?: [string, string];
    search?: (args: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: (args: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    route?: (args: CustomRoute) => Promise<BaseRouteResponse[]> | BaseRouteResponse[];
    onMouseMoveOnMap?: (coordinates: LngLat, index: number, lastCall: boolean) => void;
    onUpdateWaypoints?: (waypoints: WaypointsArray) => void;
    onRouteResult?: (result: BaseRouteResponse, type: AvailableTypes) => void;
    onBuildRouteError?: () => void;
};

const defaultProps = Object.freeze({
    geolocationTextInput: 'Моя геопозиция',
    clearFieldsText: 'Сбросить',
    changeOrderText: 'Поменять порядок',
    waypointsPlaceholders: ['Откуда', 'Куда'],
    availableTypes: ['driving', 'truck', 'walking', 'transit']
});
type DefaultProps = typeof defaultProps;

export class YMapRouteControl extends ymaps3.YMapComplexEntity<YMapRouteControlProps, DefaultProps> {
    static defaultProps = defaultProps;

    private _control: YMapControl;
    private _router: YMapCommonRouteControl;

    constructor(props: YMapRouteControlProps) {
        super(props, {container: true});
    }

    protected _onAttach(): void {
        this._control = new ymaps3.YMapControl({transparent: true});
        this._router = new YMapCommonRouteControl(this._props);

        this._control.addChild(this._router);

        this._addDirectChild(this._control);
    }

    protected _onDetach(): void {
        this._removeDirectChild(this._control);
    }
}

class YMapCommonRouteControl extends ymaps3.YMapComplexEntity<YMapRouteControlProps> {
    private _rootElement: HTMLElement;
    private _routeParametersElement: HTMLElement;
    private _routeInfoElement: HTMLElement;

    private _routeModesElement: HTMLElement;
    private _waypointsElement: HTMLElement;
    private _waypointInputFromElement: YMapWaypointInput;
    private _waypointInputToElement: YMapWaypointInput;
    private _actionsContainerElement: HTMLElement;

    private _waypoints: WaypointsArray = [null, null];

    private _routeMode: RouteOptions['type'];

    private _detachDom?: DomDetach;

    protected _onAttach(): void {
        this._rootElement = document.createElement('ymaps3');
        this._rootElement.classList.add('ymaps3--route-control');

        this._routeParametersElement = document.createElement('ymaps3');
        this._routeParametersElement.classList.add('ymaps3--route-control_parameters');
        this._rootElement.appendChild(this._routeParametersElement);

        this._routeInfoElement = document.createElement('ymaps3');
        this._routeInfoElement.classList.add('ymaps3--route-control_info');

        this._routeMode = this._props.availableTypes[0];
        this._routeModesElement = createSegmentedControl(this._props.availableTypes);
        this._routeModesElement.addEventListener('change', this._onUpdateRouteMode);
        this._routeParametersElement.appendChild(this._routeModesElement);

        this._waypointsElement = document.createElement('ymaps3');
        this._waypointsElement.classList.add('ymaps3--route-control_waypoints');
        this._routeParametersElement.appendChild(this._waypointsElement);

        this._waypointInputFromElement = this._createWaypointInput('from', this._props.waypoints?.[0] ?? undefined);
        this._waypointInputToElement = this._createWaypointInput('to', this._props.waypoints?.[1] ?? undefined);

        const {container, changeOrderButton, clearFieldsButton} = createActionsContainer({
            clearFieldsText: this._props.clearFieldsText,
            changeOrderText: this._props.changeOrderText
        });
        changeOrderButton.addEventListener('click', this._changeOrder);
        clearFieldsButton.addEventListener('click', this._clearAll);
        this._actionsContainerElement = container;
        this._routeParametersElement.appendChild(this._actionsContainerElement);

        this._detachDom = ymaps3.useDomContext(this, this._rootElement, this._waypointsElement);

        this.addChild(this._waypointInputFromElement);
        this.addChild(this._waypointInputToElement);

        this._watchContext(
            ymaps3.ControlContext,
            () => {
                const controlCtx = this._consumeContext(ymaps3.ControlContext);
                const [verticalPosition] = controlCtx.position;
                this._rootElement.classList.toggle('ymaps3--route-control_bottom', verticalPosition === 'bottom');
            },
            {immediate: true}
        );
        this._watchContext(
            ymaps3.ThemeContext,
            () => {
                const {theme} = this._consumeContext(ymaps3.ThemeContext);
                this._rootElement.classList.toggle('_dark', theme === 'dark');
            },
            {immediate: true}
        );
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;

        this.removeChild(this._waypointInputFromElement);
        this.removeChild(this._waypointInputToElement);
    }

    private _createWaypointInput(type: YMapWaypointInputProps['type'], waypoint?: LngLat): YMapWaypointInput {
        const waypointIndex = type === 'from' ? 0 : 1;
        const {geolocationTextInput, onMouseMoveOnMap} = this._props;
        return new YMapWaypointInput({
            type,
            inputPlaceholder: this._props.waypointsPlaceholders[waypointIndex],
            waypoint,
            geolocationTextInput: geolocationTextInput,
            onSelectWaypoint: (result) => {
                if (result === null) {
                    this._waypoints[waypointIndex] = null;
                    this._onUpdateWaypoints(null, waypointIndex);
                    return;
                }

                const {feature} = result;
                this._waypoints[waypointIndex] = feature;
                this._onUpdateWaypoints(feature, waypointIndex);
            },
            onMouseMoveOnMap: (coordinates, lastCall) => {
                onMouseMoveOnMap?.(coordinates, waypointIndex, lastCall);
            }
        });
    }

    private _clearAll = () => {
        this._waypointInputToElement.update({waypoint: null});
        this._waypointInputFromElement.update({waypoint: null});
    };

    private _changeOrder = () => {
        const [fromOld, toOld] = this._waypoints;
        this._waypointInputToElement.update({waypoint: fromOld === null ? null : fromOld.geometry.coordinates});
        this._waypointInputFromElement.update({waypoint: toOld === null ? null : toOld.geometry.coordinates});
    };

    private _onUpdateWaypoints(feature: Feature | null, index: number) {
        this._waypoints[index] = feature;
        this._props.onUpdateWaypoints?.(this._waypoints);

        if (this._waypoints.every((point) => point !== null)) {
            this._route();
        }
    }

    private _onUpdateRouteMode = (e: Event) => {
        const target = e.target as HTMLInputElement;
        this._routeMode = target.value as RouteOptions['type'];
        this._route();
    };

    private async _route() {
        if (!this._waypoints.every((point) => point !== null)) {
            return;
        }
        const points = this._waypoints.map((point) => point.geometry.coordinates);
        const type = this._routeMode;
        const params = {points, type, truck: type === 'truck' ? this._props.truckParameters : undefined};

        this._routeInfoElement.classList.remove('ymaps3--route-control_info__error');
        this._routeInfoElement.replaceChildren(createLoadingSpinner());
        this._rootElement.appendChild(this._routeInfoElement);

        try {
            const response = (await this._props.route?.({params, map: this.root})) ?? (await ymaps3.route(params));
            const route = response[0].toRoute();
            if (route.geometry.coordinates.length !== 0) {
                this._props.onRouteResult?.(response[0], this._routeMode);
                this._routeInfoElement.replaceChildren(...this._getRouteDetails(response[0]));
            } else {
                this._props.onBuildRouteError?.();
                this._routeInfoElement.classList.add('ymaps3--route-control_info__error');
                this._routeInfoElement.replaceChildren(...createRouteNoBuildError());
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this._props.onBuildRouteError?.();
            this._routeInfoElement.classList.add('ymaps3--route-control_info__error');
            this._routeInfoElement.replaceChildren(...createRouteServerError(() => this._route()));
        }
    }

    private _getRouteDetails(response: BaseRouteResponse): HTMLElement[] {
        if (!response.toSteps) {
            return [];
        }
        const steps = response.toSteps();
        let totalLength = 0;
        let totalDuration = 0;
        steps.forEach((step) => {
            totalLength += step.properties.length;
            totalDuration += step.properties.duration;
        });
        const formattedLength = formatDistance(totalLength);
        const formattedDuration = formatDuration(totalDuration);

        return [
            createInfoElementComponent('time', formattedDuration),
            createInfoElementComponent('distance', formattedLength)
        ];
    }
}
