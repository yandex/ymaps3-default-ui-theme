import type {DomDetach} from '@yandex/ymaps3-types';
import './index.css';

class YMapControlSpinner extends ymaps3.YMapComplexEntity<{}> {
    private _detachDom?: DomDetach;
    private _unwatchThemeContext?: () => void;

    protected override _onAttach(): void {
        const element = document.createElement('ymaps3');
        element.classList.add('ymaps3--controls-spinner');

        const circle = document.createElement('ymaps3');
        circle.classList.add('ymaps3--controls-spinner__circle');
        element.appendChild(circle);

        this._detachDom = ymaps3.useDomContext(this, element, null);

        this._unwatchThemeContext = this._watchContext(ymaps3.ThemeContext, () => this._updateTheme(circle), {
            immediate: true
        });
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;
        this._unwatchThemeContext?.();
    }

    private _updateTheme(circle: HTMLElement): void {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const spinnerControlDarkClassName = 'ymaps3--controls-spinner__dark';
        if (theme === 'dark') {
            circle.classList.add(spinnerControlDarkClassName);
        } else if (theme === 'light') {
            circle.classList.remove(spinnerControlDarkClassName);
        }
    }
}

export {YMapControlSpinner};
