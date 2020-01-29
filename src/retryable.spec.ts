import retryable from "./retryable";

describe("retryable()", () => {
	it("provides resolver, that works like Promise.resolve()", async () => {
		const value = await retryable((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});

	it("provides rejecter, that works like Promise.reject()", async () => {
		try {
			await retryable((_resolve, reject) => {
				reject("Unexpected error");
			});

			fail("Function did not throw");
		} catch (error) {
			expect(error).toContain("Unexpected error");
		}
	});

	it("provides retryer together with current number of retries, that allows retrying the action", async () => {
		const TARGET_VALUE = 10;

		let value = 0;

		const shouldRetry = () => value < TARGET_VALUE;

		await retryable((resolve, _reject, retry, retryCount) => {
			expect(retryCount).toEqual(value);

			value++;

			if (shouldRetry())
				retry();

			else
				resolve();
		});

		expect(value).toEqual(TARGET_VALUE);
	}, 100);
});
