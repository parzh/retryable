import wait from "./wait";

/** @private */
const WAIT_TIME = 300;

it("resolves after the specified amount of time", async () => {
	const start = Date.now();
	const finish = start + WAIT_TIME;

	await wait(WAIT_TIME);

	expect(Date.now()).toBeCloseTo(finish);
}, WAIT_TIME + 100);
