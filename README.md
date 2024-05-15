# @yandex/ymaps3-default-ui-theme package

---

Yandex JS API package

[![npm version](https://badge.fury.io/js/%40yandex%2Fymaps3-default-ui-theme.svg)](https://badge.fury.io/js/%40yandex%2Fymaps3-default-ui-theme)
[![npm](https://img.shields.io/npm/dm/@yandex/ymaps3-default-ui-theme.svg)](https://www.npmjs.com/package/@yandex/ymaps3-default-ui-theme)
[![Build Status](https://github.com/yandex/@yandex/ymaps3-default-ui-theme/workflows/Run%20tests/badge.svg)](https://github.com/yandex/@yandex/ymaps3-default-ui-theme/actions/workflows/tests.yml)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Yandex JS Module

Recommended use `YMapButtonExample` as usual npm package:

```sh
npm i @yandex/ymaps3-default-ui-theme
```

and dynamic import

```js
await ymaps3.ready;

// ...

const {YMapButtonExample} = await import('@yandex/ymaps3-default-ui-theme');

// ...

map.addChild(new YMapButtonExample(props));
```

### Usage without npm

You can use CDN with module loading handler in JS API on your page.

Just use `ymaps3.import`:

```js
const pkg = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
```

By default `ymaps3.import` can load self modules.
If you want also load your package, should add `loader`:

```js
// Add loader at start loaders array
ymaps3.import.loaders.unshift(async (pkg) => {
    // Process only your package
    if (!pkg.includes('@yandex/ymaps3-default-ui-theme')) return;

    // Load script directly. You can use another CDN
    await ymaps3.import.script(`https://unpkg.com/${pkg}/dist/index.js`);

    // Return result object
    return window['@yandex/ymaps3-default-ui-theme'];
});
```
