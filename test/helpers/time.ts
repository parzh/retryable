export const SECOND = 1000;

/** @private */
const PRECISION = 10 * SECOND;

export const time = (msec?: number): number => (msec ?? Date.now()) / PRECISION;

/** Wait time for an arbitrary test */
export const WAIT_TIME = 300;

export const TIMEOUT_MARGIN = 100;
