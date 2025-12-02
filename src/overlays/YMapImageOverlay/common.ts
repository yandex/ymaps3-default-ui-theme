import type {LngLat, LngLatBounds, PointGeometry, YMap, YMapFeatureProps} from '@yandex/ymaps3-types';
import {worldToPixels} from '@yandex/ymaps3-world-utils';

export type ImageOverlayProps = {
    bounds: LngLatBounds;
    image: string;
    className?: string;
} & Omit<YMapFeatureProps, 'geometry'>;

export function boundsToLeftUpperPoint(bounds: LngLatBounds): PointGeometry {
    const [leftLowerCorner, rightUpperCorner] = bounds;
    const leftUpperCorner: LngLat = [leftLowerCorner[0], rightUpperCorner[1]];

    const pointGeometry: PointGeometry = {
        type: 'Point',
        coordinates: leftUpperCorner
    };

    return pointGeometry;
}

export function boundsToWidthHeight(root: YMap, bounds: LngLatBounds): {width: number; height: number} {
    const projection = root.projection;
    const zoom = root.zoom;

    const [leftLowerCorner, rightUpperCorner] = bounds;
    const leftUpperCorner: LngLat = [leftLowerCorner[0], rightUpperCorner[1]];

    const leftUpperCornerWorldCoords = projection.toWorldCoordinates(leftUpperCorner);
    const leftUpperCornerPixelCoords = worldToPixels(
        {x: leftUpperCornerWorldCoords.x, y: leftUpperCornerWorldCoords.y},
        zoom
    );

    const leftLowerCornerWorldCoords = projection.toWorldCoordinates(leftLowerCorner);
    const leftLowerCornerPixelCoords = worldToPixels(
        {x: leftLowerCornerWorldCoords.x, y: leftLowerCornerWorldCoords.y},
        zoom
    );

    const rightUpperCornerWorldCoords = projection.toWorldCoordinates(rightUpperCorner);
    const rightUpperCornerPixelCoords = worldToPixels(
        {x: rightUpperCornerWorldCoords.x, y: rightUpperCornerWorldCoords.y},
        zoom
    );

    const width = rightUpperCornerPixelCoords.x - leftUpperCornerPixelCoords.x;
    const height = leftLowerCornerPixelCoords.y - leftUpperCornerPixelCoords.y;

    return {width, height};
}
