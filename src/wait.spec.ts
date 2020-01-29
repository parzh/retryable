import wait from "./wait";

/** @private */
const PRECISION = 10 * 1000; // 10 seconds

/** @private */
const WAIT_TIME = 300;

/** @private */
const TIMEOUT_MARGIN = 100;

/** @private */
const seconds = (msec?: number): number => (msec ?? Date.now()) / PRECISION;

it("resolves after the specified amount of time", async () => {
	const finish = seconds() + seconds(WAIT_TIME);

	await wait(WAIT_TIME);

	expect(seconds()).toBeCloseTo(finish);
}, TIMEOUT_MARGIN + WAIT_TIME);

it("resolves immediately (asynchronously) if no time is provided", async () => {
	const start = seconds();

	// @ts-ignore
	await wait();

	expect(seconds()).toBeCloseTo(start);
}, TIMEOUT_MARGIN);
