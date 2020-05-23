import retryable from "../src/retryable";
import time, { TIMEOUT_MARGIN, WAIT_TIME } from "./helpers/time";

describe("retry.after()", () => {
	it("allows retrying after a specified delay", async () => {
		let retried = false;

		const finish = time() + time(WAIT_TIME);

		await retryable((resolve, reject, retry) => {
			if (retried)
				resolve();

			else {
				retried = true;

				retry.after(WAIT_TIME);
			}
		});

		expect(time()).toBeCloseTo(finish);
		expect(retried).toBe(true);
	}, TIMEOUT_MARGIN + WAIT_TIME);

	test.each([
		[ "negative delays", -4, "is negative" ],
		[ "NaNs", NaN, "is not a number" ],
	])("forbids %s", async (name, delay, error) => {
		const promise = retryable((resolve, reject, retry) => {
			retry.after(delay);
		});

		await expect(promise).rejects.toThrowError(error);
	});

	test.each([
		[ "zero", 0 ] as const,
		[ "positive", 42 ] as const,
		[ "non-integer", 42.17 ] as const,
		[ "named (exponential)", "exponential" ] as const,
	])("allows %s delays", (kind, delay) => {
		let retried = false;

		const promise = retryable((resolve, reject, retry) => {
			if (retried)
				return resolve();

			retried = true;
			retry.after(delay);
		});

		return expect(promise).resolves.toBeUndefined();
	});
});
