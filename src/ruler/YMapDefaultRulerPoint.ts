import type {YMapListener, YMapMarker} from '@yandex/ymaps3-types';
import type {Measurements, RenderPointArgs, RulerPointState} from '@yandex/ymaps3-types/modules/ruler';
import {createYMapElement} from '../common/utils';
import markerDarkSVG from './icons/editor-point-dark.svg';
import markerLightSVG from './icons/editor-point-light.svg';
import finishSVG from './icons/icon_check.svg';
import deleteSVG from './icons/icon_trash.svg';
import {formatArea, formatDistance} from './utils';

const HIDDEN_CLASS_NAME = 'ymaps3--default-ruler-point__hidden';

export type YMapDefaultRulerPointProps = RenderPointArgs & {onDeleteAllPoints: () => void; onFinish: () => void};

export class YMapDefaultRulerPoint extends ymaps3.YMapComplexEntity<YMapDefaultRulerPointProps> {
    static readonly __implName = 'YMapDefaultRulerPoint';
    private _tooltipMarker: YMapMarker;
    private _pointMarker: YMapMarker;
    private _listener: YMapListener;

    private _pointElement!: HTMLElement;
    private _tooltipElement!: HTMLElement;
    private _measurementsElement!: HTMLElement;
    private _actionsElement!: HTMLElement;
    private _deleteButton: HTMLButtonElement;
    private _finishButton: HTMLButtonElement;
    private _isHovered: boolean = false;

    private get _isLastPoint() {
        return this._props.state.index === this._props.state.totalCount - 1;
    }

    constructor(props: YMapDefaultRulerPointProps) {
        super(props, {container: true});

        const {state} = this._props;

        this._pointMarker = this._createPointMarker(this._props);
        this.addChild(this._pointMarker);

        this._tooltipMarker = this._createTooltipMarker(state);
        this.addChild(this._tooltipMarker);
        this._measurementsElement.classList.toggle(HIDDEN_CLASS_NAME, !this._isLastPoint || state.totalCount === 1);
        this._actionsElement.classList.toggle(HIDDEN_CLASS_NAME, !this._isLastPoint || state.totalCount === 1);

        this._listener = new ymaps3.YMapListener({
            onMouseEnter: (object) => {
                if (object && object.entity === this._pointMarker) {
                    this._onMouseEnter();
                }
            },
            onMouseLeave: (object) => {
                if (object && object.entity === this._pointMarker) {
                    this._onMouseLeave();
                }
            }
        });
        this._addDirectChild(this._listener);
    }

    private _createTooltipMarker(state: RulerPointState) {
        this._tooltipElement = createYMapElement('ymaps3--default-ruler-point_tooltip');

        this._measurementsElement = createYMapElement('ymaps3--default-ruler-point_measurements');
        this._measurementsElement.textContent = this._getMeasurementsLabel(state.measurements);
        this._tooltipElement.appendChild(this._measurementsElement);

        this._actionsElement = createYMapElement('ymaps3--default-ruler-point_actions');
        this._deleteButton = document.createElement('button');
        this._deleteButton.title = 'Remove all points';
        this._deleteButton.addEventListener('click', this._onDeleteAllHandler);
        this._deleteButton.innerHTML = deleteSVG;
        this._actionsElement.appendChild(this._deleteButton);

        this._finishButton = document.createElement('button');
        this._finishButton.title = 'Finish editing the ruler';
        this._finishButton.addEventListener('click', this._onFinishHandler);
        this._finishButton.classList.add('ymaps3--default-ruler-point_actions__finish');
        const finishButtonIcon = document.createElement('span');
        finishButtonIcon.innerHTML = finishSVG;
        this._finishButton.appendChild(finishButtonIcon);
        const finishButtonLabel = document.createElement('span');
        finishButtonLabel.textContent = 'Finish';
        this._finishButton.appendChild(finishButtonLabel);
        this._actionsElement.appendChild(this._finishButton);

        this._tooltipElement.appendChild(this._actionsElement);

        const marker = new ymaps3.YMapMarker(
            {source: state.source, coordinates: state.coordinates},
            this._tooltipElement
        );

        return marker;
    }

    private _createPointMarker(props: YMapDefaultRulerPointProps) {
        const {state, onDragEnd, onDragMove, onDragStart, onDelete} = props;

        this._pointElement = createYMapElement('ymaps3--default-ruler-point_icon');
        const marker = new ymaps3.YMapMarker(
            {
                source: state.source,
                coordinates: state.coordinates,
                draggable: state.editable,
                onDragEnd,
                onDragMove,
                onDragStart,
                onDoubleClick: (_, mapEvent) => {
                    mapEvent.stopPropagation();
                    onDelete();
                }
            },
            this._pointElement
        );
        return marker;
    }

    protected _onAttach(): void {
        this._watchContext(ymaps3.ThemeContext, this._updateTheme, {immediate: true});
    }

    protected _onDetach(): void {
        this._deleteButton.removeEventListener('click', this._onDeleteAllHandler);
        this._finishButton.removeEventListener('click', this._onFinishHandler);
    }

    protected _onUpdate(props: Partial<RenderPointArgs>): void {
        if (props.state !== undefined) {
            const {state} = props;

            this._measurementsElement.textContent = this._getMeasurementsLabel(state.measurements);
            this._pointMarker.update({source: state.source, coordinates: state.coordinates, draggable: state.editable});
            this._tooltipMarker.update({source: state.source, coordinates: state.coordinates});
        }

        this._measurementsElement.classList.toggle(
            HIDDEN_CLASS_NAME,
            (!this._isHovered && !this._isLastPoint) || this._props.state.totalCount === 1
        );
        if (!this._props.state.editable) {
            this._actionsElement.classList.add(HIDDEN_CLASS_NAME);
        } else {
            this._actionsElement.classList.toggle(
                HIDDEN_CLASS_NAME,
                !this._isLastPoint || this._props.state.totalCount === 1
            );
        }
    }

    private _updateTheme = () => {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        this._pointElement.classList.toggle('_dark', themeCtx?.theme === 'dark');
        this._pointElement.innerHTML = themeCtx?.theme === 'dark' ? markerDarkSVG : markerLightSVG;
    };

    private _onMouseEnter() {
        this._isHovered = true;
        this._measurementsElement.classList.remove(HIDDEN_CLASS_NAME);
    }
    private _onMouseLeave() {
        this._isHovered = false;
        this._measurementsElement.classList.toggle(HIDDEN_CLASS_NAME, !this._isLastPoint);
    }

    private _getMeasurementsLabel(measurements: Measurements): string {
        if (measurements.type === 'planimeter') {
            return formatArea(measurements.area);
        } else if (measurements.type === 'ruler') {
            return formatDistance(measurements.distance);
        }
        return '';
    }

    private _onDeleteAllHandler = (event: MouseEvent) => {
        this._props.onDeleteAllPoints();
        event.stopPropagation();
    };
    private _onFinishHandler = (event: MouseEvent) => {
        this._props.onFinish();
        event.stopPropagation();
    };
}
