ymaps3.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('@yandex/ymaps3-default-ui-theme')) {
        return;
    }

    if (location.href.includes('localhost')) {
        await ymaps3.import.script(`/dist/index.js`);
    } else {
        await ymaps3.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    }
    // @ts-ignore
    return window['@yandex/ymaps3-default-ui-theme'];
});
