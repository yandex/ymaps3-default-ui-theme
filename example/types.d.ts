import {YMap} from '@yandex/ymaps3-types';

declare global {
    const React: typeof import('react');
    const ReactDOM: typeof import('react-dom');
    const Vue: typeof import('@vue/runtime-dom');
    let map: YMap;

    interface Window {
        map: YMap;
    }
}

export {};