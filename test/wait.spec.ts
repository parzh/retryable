import wait from "../src/wait";
import time, { WAIT_TIME, TIMEOUT_MARGIN } from "./helpers/time";

it("should resolve after the specified amount of time", async () => {
	const finish = time() + time(WAIT_TIME);

	await wait(WAIT_TIME);

	expect(time()).toBeCloseTo(finish);
}, TIMEOUT_MARGIN + WAIT_TIME);

it("should resolve immediately (asynchronously) if no time is provided", async () => {
	const start = time();

	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	await wait();

	expect(time()).toBeCloseTo(start);
});
