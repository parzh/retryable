import wait from "./wait";
import { time, WAIT_TIME, TIMEOUT_MARGIN } from "./time-test-helpers";

it("resolves after the specified amount of time", async () => {
	const finish = time() + time(WAIT_TIME);

	await wait(WAIT_TIME);

	expect(time()).toBeCloseTo(finish);
}, TIMEOUT_MARGIN + WAIT_TIME);

it("resolves immediately (asynchronously) if no time is provided", async () => {
	const start = time();

	// @ts-ignore
	await wait();

	expect(time()).toBeCloseTo(start);
}, TIMEOUT_MARGIN);
