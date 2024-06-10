# @yandex/ymaps3-default-ui-theme package

---

Yandex JS API package

[![npm version](https://badge.fury.io/js/%40yandex%2Fymaps3-default-ui-theme.svg)](https://badge.fury.io/js/%40yandex%2Fymaps3-default-ui-theme)
[![npm](https://img.shields.io/npm/dm/@yandex/ymaps3-default-ui-theme.svg)](https://www.npmjs.com/package/@yandex/ymaps3-default-ui-theme)
[![Build Status](https://github.com/yandex/ymaps3-default-ui-theme/workflows/Run%20tests/badge.svg)](https://github.com/yandex/@yandex/ymaps3-default-ui-theme/actions/workflows/tests.yml)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Yandex JS Module

Recommended use `@yandex/ymaps3-default-ui-theme` as usual npm package:

```sh
npm install @yandex/ymaps3-default-ui-theme
```

and dynamic import

```js
await ymaps3.ready;

// ...

const {YMapDefaultMarker} = await import('@yandex/ymaps3-default-ui-theme');

// ...

map.addChild(new YMapDefaultMarker(props));
```

### Usage without npm

You can use CDN with module loading handler in JS API on your page.

By default `ymaps3.import` can load self modules.
Just use `ymaps3.registerCdn` and `ymaps3.import`:

```js
// register in `ymaps3.import` which CDN to take the package from
ymaps3.import.registerCdn(
  'https://cdn.jsdelivr.net/npm/{package}',
  '@yandex/ymaps3-default-ui-theme@latest'
);

// ...

// import package from CDN
const pkg = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
```
