import retryable from "../src/retryable";
import time, { TIMEOUT_MARGIN } from "./helpers/time";

describe("retry.after(msec)", () => {
	test.each([
		[ "zero", 0 ],
		[ "positive", TIMEOUT_MARGIN ],
		[ "non-integer", TIMEOUT_MARGIN - 0.1 ],
	] as const)("should allow %s delays", async (kind, delay) => {
		let retried = false;

		const finish = time() + time(delay);

		await retryable((resolve, reject, retry) => {
			if (retried)
				return resolve();

			retried = true;
			retry.after(delay);
		});

		expect(time()).toBeCloseTo(finish);
		expect(retried).toBe(true);
	});

	test.each([
		[ "negative delays", -4, "is negative" ],
		[ "NaNs", NaN, "is not a number" ],
	])("should forbid %s", async (name, delay, error) => {
		const promise = retryable((resolve, reject, retry) => {
			retry.after(delay);
		});

		await expect(promise).rejects.toThrowError(error);
	});
});

describe('retry.after("exponential")', () => {
	it("should trigger exponential backoff", async () => {
		const start = time();
		const times: number[] = [];
		const RETRY_LIMIT = 4;

		await retryable((resolve, reject, retry) => {
			times.push(time());

			if (retry.count >= RETRY_LIMIT)
				return resolve();

			retry.after("exponential");
		});

		expect(times[0] - start).toBeCloseTo(time(0));
		expect(times[1] - start).toBeCloseTo(time(0) + time(100));
		expect(times[2] - start).toBeCloseTo(time(0) + time(100) + time(200));
		expect(times[3] - start).toBeCloseTo(time(0) + time(100) + time(200) + time(400));
		expect(times[4] - start).toBeCloseTo(time(0) + time(100) + time(200) + time(400) + time(800));

		expect(times).toHaveLength(5);
	}, TIMEOUT_MARGIN + 800 + 400 + 200 + 100);
});
