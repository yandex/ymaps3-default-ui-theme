import i18next from 'i18next';

export function formatDistance(distance: number): string {
    return distance > 900
        ? i18next.t('distance.kilometers', {value: roundDistance(distance / 1000)})
        : i18next.t('distance.meters', {value: roundDistance(distance)});
}

export function formatArea(area: number): string {
    return area > 900_000
        ? i18next.t('area.squareKilometers', {value: roundDistance(area / 1_000_000)})
        : i18next.t('area.squareMeters', {value: roundDistance(area)});
}

function roundDistance(distance: number): number {
    if (distance > 100) {
        return Math.round(distance);
    }
    const factor = Math.pow(10, distance > 10 ? 1 : 2);
    return Math.round(distance * factor) / factor;
}
