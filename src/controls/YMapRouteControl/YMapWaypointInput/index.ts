import {
    DomDetach,
    DomEvent,
    DomEventHandlerObject,
    LngLat,
    YMapListener,
    SearchResponse,
    SuggestResponse
} from '@yandex/ymaps3-types';
import type {Feature as SearchResponseFeature} from '@yandex/ymaps3-types/imperative/search';
import debounce from 'lodash/debounce';
import {CustomSearch, CustomSuggest, SearchParams} from '../../YMapSearchControl';
import {YMapSuggest} from '../../YMapSearchControl/YMapSuggest';
import emptyIndicatorSVG from '../icons/indicators/empty-indicator.svg';
import focusIndicatorSVG from '../icons/indicators/focus-indicator.svg';
import settedIndicatorSVG from '../icons/indicators/setted-indicator.svg';
import locationSVG from '../icons/location-button.svg';
import resetSVG from '../icons/reset-button.svg';
import './index.css';

const INDICATOR_COLORS = {
    light: {from: '#2E4CE5', to: '#313133'},
    dark: {from: '#D6FD63', to: '#C8D2E6'}
};

export type SelectWaypointArgs = {
    feature: SearchResponseFeature;
};

export type YMapWaypointInputProps = {
    type: 'from' | 'to';
    inputPlaceholder: string;
    waypoint?: LngLat | null;
    geolocationTextInput?: string;
    search?: ({params, map}: CustomSearch) => Promise<SearchResponse> | SearchResponse;
    suggest?: (args: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
    onSelectWaypoint?: (args: SelectWaypointArgs | null) => void;
    onMouseMoveOnMap?: (coordinates: LngLat, lastCall: boolean) => void;
};

const defaultProps = Object.freeze({geolocationTextInput: 'My location'});

export class YMapWaypointInput extends ymaps3.YMapComplexEntity<YMapWaypointInputProps, typeof defaultProps> {
    static defaultProps = defaultProps;
    private _detachDom?: DomDetach;
    private _suggestComponent?: YMapSuggest;

    private _rootElement: HTMLElement;
    private _inputEl: HTMLInputElement;
    private _indicator: HTMLElement;
    private _locationButton: HTMLButtonElement;
    private _resetButton: HTMLButtonElement;

    private _mapListener: YMapListener;

    private _isBottomPosition: boolean;
    private _isHoverMode = false;

    private get _isInputFocused(): boolean {
        return document.activeElement === this._inputEl;
    }

    public triggerFocus(): void {
        this._inputEl.focus();
    }

    constructor(props: YMapWaypointInputProps) {
        super(props, {container: true});

        this._suggestComponent = new YMapSuggest({
            suggest: this._props.suggest,
            setSearchInputValue: (text) => {
                this._inputEl.value = text;
            },
            onSuggestClick: (params: SearchParams) => {
                this._inputEl.value = params.text;
                this._submitWaypointInput();
            }
        });

        this._mapListener = new ymaps3.YMapListener({
            onMouseMove: this._onMapMouseMove,
            onMouseLeave: this._onMapMouseLeave,
            onFastClick: this._onMapFastClick
        });
        this._addDirectChild(this._mapListener);
    }

    protected _onAttach(): void {
        this._rootElement = document.createElement('ymaps3');
        this._rootElement.classList.add('ymaps3--route-control_waypoint-input');

        const form = document.createElement('form');
        form.addEventListener('submit', this._submitWaypointInput);
        form.classList.add('ymaps3--route-control_waypoint-input_form');

        this._indicator = document.createElement('ymaps3');
        this._indicator.classList.add('ymaps3--route-control_waypoint-input__indicator');
        this._updateIndicatorStatus('empty');
        form.appendChild(this._indicator);

        this._inputEl = document.createElement('input');
        this._inputEl.classList.add('ymaps3--route-control_waypoint-input__field');
        this._inputEl.placeholder = this._props.inputPlaceholder;
        this._inputEl.addEventListener('input', this._onUpdateWaypoint);
        this._inputEl.addEventListener('focus', this._onFocusInput);
        this._inputEl.addEventListener('blur', this._onBlurInput);
        this._inputEl.addEventListener('keydown', this._onKeydownInput);
        form.appendChild(this._inputEl);

        const fieldButton = document.createElement('ymaps3');
        fieldButton.classList.add('ymaps3--route-control_waypoint-input__field-buttons');
        form.appendChild(fieldButton);

        this._locationButton = document.createElement('button');
        this._locationButton.classList.add('ymaps3--route-control_waypoint-input__field-buttons__location');
        this._locationButton.insertAdjacentHTML('afterbegin', locationSVG);
        fieldButton.appendChild(this._locationButton);

        this._resetButton = document.createElement('button');
        this._resetButton.classList.add('ymaps3--route-control_waypoint-input__field-buttons__reset');
        this._resetButton.insertAdjacentHTML('afterbegin', resetSVG);
        fieldButton.appendChild(this._resetButton);

        const suggestContainer = document.createElement('ymaps3');
        suggestContainer.classList.add('ymaps3--route-control_waypoint-input_suggest');

        this._rootElement.appendChild(form);
        this._rootElement.appendChild(suggestContainer);

        this._detachDom = ymaps3.useDomContext(this, this._rootElement, suggestContainer);

        this._watchContext(
            ymaps3.ControlContext,
            () => {
                const controlCtx = this._consumeContext(ymaps3.ControlContext);
                const [verticalPosition] = controlCtx.position;
                this._isBottomPosition = verticalPosition === 'bottom';
                suggestContainer.classList.toggle('_bottom', this._isBottomPosition);
            },
            {immediate: true}
        );
        this._watchContext(
            ymaps3.ThemeContext,
            () => {
                const {theme} = this._consumeContext(ymaps3.ThemeContext);
                this._indicator.style.color = INDICATOR_COLORS[theme][this._props.type];
                this._rootElement.classList.toggle('_dark-input', theme === 'dark');
            },
            {immediate: true}
        );

        if (this._props.waypoint !== undefined && this._props.waypoint !== null) {
            this._search({text: this._props.waypoint.toString()}, this._props.waypoint);
        }
    }

    protected _onUpdate(diffProps: Partial<YMapWaypointInputProps>): void {
        if (this._props.waypoint !== undefined) {
            if (this._props.waypoint === null) {
                this._props.waypoint = undefined;
                this._resetInput();
            } else {
                this._search({text: this._props.waypoint.toString()}, this._props.waypoint);
            }
        }

        if (diffProps.inputPlaceholder !== undefined) {
            this._inputEl.placeholder = diffProps.inputPlaceholder;
        }
    }

    protected _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
        this._removeDirectChild(this._suggestComponent);
    }

    private _updateIndicatorStatus(status: 'empty' | 'focus' | 'setted'): void {
        this._indicator.classList.toggle('ymaps3--route-control_waypoint-input__indicator_empty', status === 'empty');

        switch (status) {
            case 'empty':
                this._indicator.innerHTML = emptyIndicatorSVG;
                break;
            case 'focus':
                this._indicator.innerHTML = focusIndicatorSVG;
                break;
            case 'setted':
                this._indicator.innerHTML = settedIndicatorSVG;
                break;
        }
    }

    private _resetInput() {
        this._inputEl.value = '';
        this._updateIndicatorStatus('empty');
        this._props.onSelectWaypoint(null);
    }

    private _onUpdateWaypoint = debounce((e: Event) => {
        const target = e.target as HTMLInputElement;
        this._suggestComponent.update({searchInputValue: target.value});
    }, 200);

    private _onFocusInput = (_event: FocusEvent) => {
        this._addDirectChild(this._suggestComponent);
        this._updateIndicatorStatus('focus');
    };

    private _onBlurInput = (event: FocusEvent) => {
        if (this._isHoverMode) {
            this._inputEl.focus();
            return;
        }
        if (event.relatedTarget !== this._suggestComponent.activeSuggest) {
            this._removeDirectChild(this._suggestComponent);
        }
        if (event.relatedTarget === this._locationButton) {
            this._getGeolocation();
            return;
        }
        if (event.relatedTarget === this._resetButton) {
            this._resetInput();
            return;
        }
        this._updateIndicatorStatus('empty');
    };

    private _submitWaypointInput = (event?: SubmitEvent) => {
        event?.preventDefault();
        if (!this._suggestComponent.activeSuggest) {
            this._inputEl.focus();
            return;
        }
        const {uri, text} = this._suggestComponent.activeSuggest.dataset;
        this._search({uri, text});
        this._removeDirectChild(this._suggestComponent);
        this._inputEl.blur();
    };

    private _onKeydownInput = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this._suggestComponent.update({suggestNavigationAction: {isNextSuggest: !this._isBottomPosition}});
                break;
            case 'ArrowUp':
                event.preventDefault();
                this._suggestComponent.update({suggestNavigationAction: {isNextSuggest: this._isBottomPosition}});
                break;
        }
    };

    private async _getGeolocation() {
        const text = this._props.geolocationTextInput;
        this._inputEl.value = text;

        const position = await ymaps3.geolocation.getPosition();
        const feature: SearchResponseFeature = {
            properties: {name: text, description: text},
            geometry: {type: 'Point', coordinates: position.coords}
        };
        this._updateIndicatorStatus('setted');
        this._props.onSelectWaypoint({feature});
    }

    private async _search(params: SearchParams, reverseGeocodingCoordinate?: LngLat) {
        try {
            const searchResult =
                (await this._props.search?.({params, map: this.root})) ?? (await ymaps3.search(params));

            if (searchResult.length === 0) {
                return;
            }

            const feature = searchResult[0];
            if (reverseGeocodingCoordinate) {
                this._inputEl.value = feature.properties.name;
                feature.geometry.coordinates = reverseGeocodingCoordinate;
            }
            this._updateIndicatorStatus('setted');
            this._props.onSelectWaypoint({feature});
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this._updateIndicatorStatus('empty');
        }
    }

    private _onMapMouseLeave = (object: DomEventHandlerObject, event: DomEvent): void => {
        if (this._isInputFocused && object === undefined) {
            this._isHoverMode = false;
            this._props.onMouseMoveOnMap?.(event.coordinates, true);
        }
    };

    private _onMapMouseMove = (object: DomEventHandlerObject, event: DomEvent): void => {
        if (this._isInputFocused) {
            this._isHoverMode = true;
            this._props.onMouseMoveOnMap?.(event.coordinates, false);
        }
    };

    private _onMapFastClick = (object: DomEventHandlerObject, event: DomEvent): void => {
        if (this._isInputFocused) {
            this._isHoverMode = false;
            this._props.onMouseMoveOnMap?.(event.coordinates, true);
            this._inputEl.blur();
            this._search({text: event.coordinates.toString()}, event.coordinates);
        }
    };
}
