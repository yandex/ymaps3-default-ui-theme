import type {LngLat, LngLatBounds, PointGeometry, YMap} from '@yandex/ymaps3-types';
import {worldToPixels} from '@yandex/ymaps3-world-utils';

function boundsToLeftUpperPoint(bounds: LngLatBounds): {
    leftUpperCorner: LngLat;
    leftLowerCorner: LngLat;
    rightUpperCorner: LngLat;
} {
    const [leftLowerCorner, rightUpperCorner] = bounds;
    const leftUpperCorner: LngLat = [leftLowerCorner[0], rightUpperCorner[1]];
    return {leftUpperCorner, leftLowerCorner, rightUpperCorner};
}

export function leftUpperPointToPointGeometry(bounds: LngLatBounds): PointGeometry {
    const {leftUpperCorner} = boundsToLeftUpperPoint(bounds);

    const pointGeometry: PointGeometry = {
        type: 'Point',
        coordinates: leftUpperCorner
    };

    return pointGeometry;
}

export function boundsToWidthHeight(root: YMap, bounds: LngLatBounds): {width: number; height: number} {
    const projection = root.projection;
    const zoom = root.zoom;

    const {leftUpperCorner, leftLowerCorner, rightUpperCorner} = boundsToLeftUpperPoint(bounds);

    const leftUpperCornerWorldCoords = projection.toWorldCoordinates(leftUpperCorner);
    const leftUpperCornerPixelCoords = worldToPixels(leftUpperCornerWorldCoords, zoom);

    const leftLowerCornerWorldCoords = projection.toWorldCoordinates(leftLowerCorner);
    const leftLowerCornerPixelCoords = worldToPixels(leftLowerCornerWorldCoords, zoom);

    const rightUpperCornerWorldCoords = projection.toWorldCoordinates(rightUpperCorner);
    const rightUpperCornerPixelCoords = worldToPixels(rightUpperCornerWorldCoords, zoom);

    const width = rightUpperCornerPixelCoords.x - leftUpperCornerPixelCoords.x;
    const height = leftLowerCornerPixelCoords.y - leftUpperCornerPixelCoords.y;

    return {width, height};
}
