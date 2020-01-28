import wait from "./wait";

/** @private */
const MSEC_PER_SEC = 1000;

/** @private */
const WAIT_TIME = 300;

/** @private */
const seconds = (msec?: number): number => (msec ?? Date.now()) / MSEC_PER_SEC;

it("resolves after the specified amount of time", async () => {
	const finish = seconds() + seconds(WAIT_TIME);

	await wait(WAIT_TIME);

	expect(seconds()).toBeCloseTo(finish);
}, WAIT_TIME + 100);
