module.exports = {
    ...require('@yandex/ymaps3-cli/jest.config'),
    transform: {
        '^.+\\.svg$': '<rootDir>/tests/utils/svgTransform.js'
    }
};
