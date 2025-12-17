const defaultConfig = require('@yandex/ymaps3-cli/jest.config');
module.exports = {
    ...defaultConfig,
    transform: {
        ...defaultConfig.transform,
        '^.+\\.(ts|tsx|js)$': 'babel-jest',
        '^.+\\.svg$': '<rootDir>/tests/utils/svgTransform.js'
    }
};
