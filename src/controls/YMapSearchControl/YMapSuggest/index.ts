import type {DomDetach} from '@yandex/ymaps3-types/imperative/DomContext';
import type {SuggestResponse, SuggestResponseItem} from '@yandex/ymaps3-types/imperative/suggest';
import type {SearchParams, CustomSuggest} from '..';

import './index.css';

const SUGGEST_CLASS = 'ymaps3--suggest-control';
const SUGGEST_ITEM_CLASS = 'ymaps3--suggest-item-control';
const SUGGEST_ITEM_TITLE_CLASS = 'ymaps3--suggest-item-control__title';
const SUGGEST_ITEM_SUBTITLE_CLASS = 'ymaps3--suggest-item-control__subtitle';
const HIDE_CLASS = '_hide';
const ACTIVE_CLASS = '_active';

type SuggestNavigationAction = {
    isNextSuggest: boolean;
};

type YMapSuggestProps = {
    setSearchInputValue: (text: string) => void;
    onSuggestClick: (params: SearchParams) => void;
    searchInputValue?: string;
    suggestNavigationAction?: SuggestNavigationAction;
    suggest?: ({text, map}: CustomSuggest) => Promise<SuggestResponse> | SuggestResponse;
};

class YMapSuggest extends ymaps3.YMapComplexEntity<YMapSuggestProps> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _unwatchThemeContext?: () => void;
    private _unwatchControlContext?: () => void;
    private _searchInputValue?: string;

    public get activeSuggest() {
        return this._getSuggestElements().find((element) => element?.classList.contains(ACTIVE_CLASS));
    }

    private _updateSuggest(props: Partial<YMapSuggestProps>) {
        if (props.searchInputValue !== undefined && props.searchInputValue !== this._searchInputValue) {
            this._searchInputValue = props.searchInputValue;
            this._updateSuggestList(props.searchInputValue);
        }

        if (props.suggestNavigationAction !== undefined) {
            this._updateActiveSuggest(props.suggestNavigationAction);
        }
    }

    private _updateSuggestList = async (searchInputValue: YMapSuggestProps['searchInputValue']) => {
        const suggestResult =
            (await this._props.suggest?.({text: searchInputValue, map: this.root})) ??
            (await ymaps3.suggest({text: searchInputValue}));

        this._removeSuggestItems();

        this._addSuggestItems(suggestResult, this._props.onSuggestClick);

        this._getSuggestElements().at(0)?.classList.add(ACTIVE_CLASS);
        this._rootElement?.classList.toggle(HIDE_CLASS, !this.children.length);
    };

    private _updateActiveSuggest = (changeActiveSuggest: SuggestNavigationAction) => {
        const suggestElements = this._getSuggestElements();

        if (!suggestElements) {
            return;
        }

        let activeIndex = suggestElements.findIndex((element) => element.classList.contains(ACTIVE_CLASS));

        if (changeActiveSuggest.isNextSuggest) {
            activeIndex = (activeIndex + 1) % suggestElements.length; // cyclic movement
        } else {
            activeIndex =
                activeIndex === -1
                    ? suggestElements.length - 1
                    : (activeIndex - 1 + suggestElements.length) % suggestElements.length;
        }

        suggestElements.forEach((element, index) => {
            element.classList.toggle(ACTIVE_CLASS, index === activeIndex);
        });

        if (suggestElements[activeIndex] && suggestElements[activeIndex]?.dataset?.text) {
            this._props.setSearchInputValue(suggestElements[activeIndex].dataset.text);
        }
    };

    private _removeSuggestItems = () => {
        while (this.children.length) {
            this.removeChild(this.children[0]);
        }
    };

    private _addSuggestItems(suggest: SuggestResponse, onSuggestClick: YMapSuggestProps['onSuggestClick']) {
        suggest.forEach((suggestItem) => {
            const searchParams = {uri: suggestItem.uri, text: suggestItem.value};

            this.addChild(
                new YMapSuggestItem({
                    suggestItem,
                    onClick: () => onSuggestClick(searchParams)
                })
            );
        });
    }

    private _onMouseOverHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const hoveredElement = target.closest(`.${SUGGEST_ITEM_CLASS}`);
        if (!hoveredElement) {
            return;
        }

        const suggestElements = this._getSuggestElements();
        suggestElements.forEach((element) => element.classList.toggle(ACTIVE_CLASS, element === hoveredElement));
    };

    private _onMouseOutHandler = (event: MouseEvent) => {
        if (!this._rootElement.contains(event.relatedTarget as Node)) {
            const suggestElements = this._getSuggestElements();
            suggestElements.forEach((element) => element.classList.remove(ACTIVE_CLASS));
        }
    };

    private _getSuggestElements = () =>
        (this.children.filter((child) => child instanceof YMapSuggestItem) as YMapSuggestItem[]).map(
            (child) => child.element
        );

    private _updateTheme(container: HTMLElement): void {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const darkClassName = '_dark';
        container.classList.toggle(darkClassName, theme === 'dark');
    }

    private _updateVerticalOrder(container: HTMLElement): void {
        const controlCtx = this._consumeContext(ymaps3.ControlContext);
        if (!controlCtx) {
            return;
        }

        const verticalPosition = controlCtx.position[0];
        const bottomOrderClassName = '_bottom';
        container.classList.toggle(bottomOrderClassName, verticalPosition === 'bottom');
    }

    protected override _onAttach(): void {
        this._rootElement = document.createElement('ymaps3');
        this._rootElement.classList.add(SUGGEST_CLASS);
        this._rootElement?.classList.toggle(HIDE_CLASS, !this.children.length);
        this._rootElement.addEventListener('mouseover', this._onMouseOverHandler);
        this._rootElement.addEventListener('mouseout', this._onMouseOutHandler);

        this._detachDom = ymaps3.useDomContext(this, this._rootElement, this._rootElement);

        this._updateSuggest(this._props);

        this._unwatchThemeContext = this._watchContext(
            ymaps3.ThemeContext,
            () => this._updateTheme(this._rootElement),
            {immediate: true}
        );

        this._unwatchControlContext = this._watchContext(
            ymaps3.ControlContext,
            () => this._updateVerticalOrder(this._rootElement),
            {immediate: true}
        );
    }

    protected _onUpdate(props: Partial<YMapSuggestProps>): void {
        this._updateSuggest(props);
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;

        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;
        this._unwatchControlContext?.();
        this._unwatchControlContext = undefined;

        this._rootElement.removeEventListener('mouseover', this._onMouseOverHandler);
        this._rootElement.removeEventListener('mouseout', this._onMouseOutHandler);
        this._rootElement = undefined;
    }
}

type YMapSuggestItemProps = {
    suggestItem: SuggestResponseItem;
    onClick: () => void;
};

class YMapSuggestItem extends ymaps3.YMapComplexEntity<YMapSuggestItemProps> {
    private _detachDom?: DomDetach;
    private _rootElement?: HTMLElement;
    private _unwatchThemeContext?: () => void;

    public get element() {
        return this._rootElement;
    }

    private _updateTheme(container: HTMLElement, titleElement: HTMLElement, subtitleElement?: HTMLElement): void {
        const themeCtx = this._consumeContext(ymaps3.ThemeContext);
        if (!themeCtx) {
            return;
        }
        const {theme} = themeCtx;
        const darkClassName = '_dark';
        container.classList.toggle(darkClassName, theme === 'dark');
        titleElement.classList.toggle(darkClassName, theme === 'dark');
        subtitleElement?.classList.toggle(darkClassName, theme === 'dark');
    }

    protected override _onAttach(): void {
        this._rootElement = document.createElement('ymaps3');
        this._rootElement.classList.add(SUGGEST_ITEM_CLASS);
        this._rootElement.tabIndex = -1;
        this._rootElement.addEventListener('click', this._props.onClick);
        this._rootElement.dataset.text = this._props.suggestItem.title.text;
        if (this._props.suggestItem?.uri) {
            this._rootElement.dataset.uri = this._props.suggestItem.uri;
        }

        this._detachDom = ymaps3.useDomContext(this, this._rootElement, this._rootElement);

        const titleElement = document.createElement('ymaps3');
        titleElement.classList.add(SUGGEST_ITEM_TITLE_CLASS);
        titleElement.innerText = this._props.suggestItem.title.text;
        this._rootElement.appendChild(titleElement);

        let subtitleElement: HTMLElement | undefined;
        if (this._props.suggestItem.subtitle) {
            subtitleElement = document.createElement('ymaps3');
            subtitleElement.classList.add(SUGGEST_ITEM_SUBTITLE_CLASS);
            subtitleElement.innerText = this._props.suggestItem.subtitle.text;
            this._rootElement.appendChild(subtitleElement);
        }

        this._unwatchThemeContext = this._watchContext(
            ymaps3.ThemeContext,
            () => this._updateTheme(this._rootElement, titleElement, subtitleElement),
            {
                immediate: true
            }
        );
    }

    protected override _onDetach(): void {
        this._detachDom?.();
        this._detachDom = undefined;

        this._unwatchThemeContext?.();
        this._unwatchThemeContext = undefined;

        this._rootElement.removeEventListener('click', this._props.onClick);
        this._rootElement = undefined;
    }
}

export {YMapSuggest};
