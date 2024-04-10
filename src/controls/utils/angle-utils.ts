export interface Position {
    x: number;
    y: number;
}

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const CLICK_TOLERANCE_PX = 3;

/**
 * Resets the tilt value to the min or max value
 * @param tilt - current tilt in degree
 * @param min - min tilt in degree
 * @param max - max tilt in degree
 * @returns reset tilt value
 */
export const toggleTilt = (tilt: number, min: number, max: number): number => {
    return Math.round(tilt) === min ? max : min;
};

/**
 * Resets the azimuth value
 * @param azimuth - current tilt in rad
 * @returns reset azimuth value in rad
 */
export const toggleRotate = (azimuth: number): number => {
    if (azimuth === 0) {
        return -Math.PI / 4;
    }
    return azimuth < Math.PI ? 0 : Math.PI * 2;
};

/**
 * Calculates the azimuth change by mouse movement
 * @param startPosition - position of the starting of the mouse movement
 * @param controlPosition - position of the azimuth change control
 * @param eventPagePosition - current mouse position
 * @returns delta azimuth value
 */
export const getDeltaAzimuth = (
    startPosition: Position,
    controlPosition: Position,
    eventPagePosition: Position
): number => {
    return (
        Math.atan2(eventPagePosition.y - controlPosition.y, eventPagePosition.x - controlPosition.x) -
        Math.atan2(startPosition.y - controlPosition.y, startPosition.x - controlPosition.x)
    );
};

export const radToDeg = (rad: number): number => rad * RAD_TO_DEG;
export const degToRad = (deg: number): number => deg * DEG_TO_RAD;
