import retryable from "../src/retryable";
import time, { TIMEOUT_MARGIN } from "./helpers/time";

declare global {
	interface ObjectConstructor {
		entries<Obj extends NodeJS.Dict<unknown>, Key extends keyof Obj>(obj: Obj): [Key, Obj[Key]][];
	}
}

describe("retry.after(msec)", () => {
	const delays = {
		zero: 0,
		positive: 100,
		'non-integer': 42.17,
	} as const;

	test.each(Object.entries(delays))("should allow %s delays", async (kind, delay) => {
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
	}, delays.positive + TIMEOUT_MARGIN);

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
		const times = [ time() ];
		const RETRY_LIMIT = 4;

		await retryable((resolve, reject, retry) => {
			times.push(time());

			if (retry.count >= RETRY_LIMIT)
				return resolve();

			retry.after("exponential");
		});

		expect(times[1] - times[0]).toBeCloseTo(time(0));
		expect(times[2] - times[1]).toBeCloseTo(time(100));
		expect(times[3] - times[2]).toBeCloseTo(time(200));
		expect(times[4] - times[3]).toBeCloseTo(time(400));
		expect(times[5] - times[4]).toBeCloseTo(time(800));

		expect(times).toHaveLength(6);
	}, TIMEOUT_MARGIN + 800 + 400 + 200 + 100);
});
