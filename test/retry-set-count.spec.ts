import retryable from "../src/retryable";

/** @private */
const RETRIES_BEFORE_RESET = 5;

describe("retry.setCount()", () => {
	it("should allow explicitly setting the value of retry count", async () => {
		let didReset = false;

		const lastRetryCount = await retryable<number>((resolve, reject, retry) => {
			if (didReset)
				resolve(retry.count);

			else if (retry.count < RETRIES_BEFORE_RESET)
				retry();

			else {
				didReset = true;
				retry.setCount(0);
				retry();
			}
		});

		expect(lastRetryCount).toBe(0);
		expect(didReset).toBe(true);
	});

	test.each([
		[ "negative numbers", -4, "is negative" ],
		[ "non-integers", 42.17, "not an integer" ],
		[ "NaNs", NaN, "is not a number" ],
	])("should forbid %s", async (name, count, error) => {
		const promise = retryable((resolve, reject, retry) => {
			retry.setCount(count);
		});

		await expect(promise).rejects.toThrowError(error);
	});
});

describe("resetRetryCount()", () => {
	it.todo("deprecated in favor of `retry.setCount(0)`");
});
