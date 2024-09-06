import i18next from 'i18next';

await i18next.init({
    lng: 'ru',
    // debug: true,
    resources: {
        ru: {
            translation: {
                distance: {
                    meters: '{{value, number}} м',
                    kilometers: '{{value, number}} км'
                },
                area: {
                    squareMeters: '{{value, number}} м²',
                    squareKilometers: '{{value, number}} км²'
                }
            }
        }
    }
});
