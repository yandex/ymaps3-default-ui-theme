import type {DrawingStyle} from '@yandex/ymaps3-types';
import type {YMapRuler, YMapRulerProps} from '@yandex/ymaps3-types/modules/ruler';
import {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import type TVue from '@vue/runtime-core';
import {createYMapElement} from '../common/utils';
import markerDarkSVG from './icons/editor-point-dark.svg';
import markerLightSVG from './icons/editor-point-light.svg';
import './YMapDefaultRuler.css';
import {YMapDefaultRulerPoint} from './YMapDefaultRulerPoint';

const {YMapRuler: YMapRulerCore} = await ymaps3.import('@yandex/ymaps3-ruler');

const COLOR_LIGHT = '#FF4433';
const COLOR_DARK = '#FF5B4D';

const FILL_LIGHT = '#FF191914';
const FILL_DARK = '#FF9A9A29';

export type YMapDefaultRulerProps = Pick<
    YMapRulerProps,
    'points' | 'zIndex' | 'editable' | 'onUpdate' | 'onUpdateEnd' | 'onUpdateStart' | 'source' | 'type'
> & {onFinish?: () => void};

export const YMapDefaultRulerVuefyOptions: CustomVuefyOptions<YMapDefaultRuler> = {
    props: {
        type: String as TVue.PropType<YMapDefaultRulerProps['type']>,
        points: Array as TVue.PropType<YMapDefaultRulerProps['points']>,
        editable: {
            type: Boolean as TVue.PropType<YMapDefaultRulerProps['editable']>,
            default: undefined
        },
        source: String as TVue.PropType<YMapDefaultRulerProps['type']>,
        zIndex: Number as TVue.PropType<YMapDefaultRulerProps['zIndex']>,
        onUpdate: Function as TVue.PropType<YMapDefaultRulerProps['onUpdate']>,
        onUpdateEnd: Function as TVue.PropType<YMapDefaultRulerProps['onUpdateEnd']>,
        onUpdateStart: Function as TVue.PropType<YMapDefaultRulerProps['onUpdateStart']>,
        onFinish: Function as TVue.PropType<YMapDefaultRulerProps['onFinish']>
    }
};

export class YMapDefaultRuler extends ymaps3.YMapComplexEntity<YMapDefaultRulerProps> {
    static readonly __implName = 'YMapDefaultRuler';
    static [ymaps3.optionsKeyVuefy] = YMapDefaultRulerVuefyOptions;

    private _ruler!: YMapRuler;
    private _previewPoint: HTMLElement;

    constructor(props: YMapDefaultRulerProps) {
        super(props);
        this._previewPoint = createYMapElement('ymaps3--default-ruler-preview-point');
    }

    protected _onAttach(): void {
        this._ruler = new YMapRulerCore({
            ...this._props,
            point: (params) =>
                new YMapDefaultRulerPoint({
                    ...params,
                    onDeleteAllPoints: this._onDeleteAllPoints,
                    onFinish: this._onFinish
                }),
            geometry: {style: {}},
            previewPoint: this._previewPoint
        });
        this.addChild(this._ruler);

        this._watchContext(ymaps3.ThemeContext, this._updateTheme, {immediate: true});
    }

    protected _onUpdate(): void {
        this._ruler.update(this._props);
    }

    protected _onDetach(): void {
        this.removeChild(this._ruler);
    }

    private _updateTheme = () => {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        this._previewPoint.innerHTML = themeCtx?.theme === 'dark' ? markerDarkSVG : markerLightSVG;
        const fill = themeCtx?.theme === 'dark' ? FILL_DARK : FILL_LIGHT;
        const color = themeCtx?.theme === 'dark' ? COLOR_DARK : COLOR_LIGHT;
        const featureStyle: DrawingStyle = {simplificationRate: 0, fill, stroke: [{width: 2, color}]};
        this._ruler.update({geometry: {style: featureStyle}});
    };

    private _onDeleteAllPoints = () => {
        this.update({points: []});
    };
    private _onFinish = () => {
        this.update({editable: false});
        this._props.onFinish?.();
    };
}
