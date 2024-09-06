export function createYMapElement(className?: string): HTMLElement {
    const el = document.createElement('ymaps3');
    if (className) {
        el.className = className;
    }
    return el;
}
