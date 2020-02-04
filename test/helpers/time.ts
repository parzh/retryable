export const SECOND = 1000;

/** Wait time for an arbitrary test */
export const WAIT_TIME = 300;

export const TIMEOUT_MARGIN = 100;

/** @private */
const PRECISION = 10 * SECOND;

/**
 * Returns the current time in test-friendly format
 * @uses PRECISION constant internally
 * @example
 * time(); => 158055352.1882
 */
export default function time(): number;

/**
 * Converts the supplied number of milliseconds
 * to the test-friendly format
 * @uses PRECISION constant internally
 * @example
 * time(300); => 0.03
 */
export default function time(msec: number): number;

export default function time(msec?: number): number {
	return (msec ?? Date.now()) / PRECISION;
}

export { time };
