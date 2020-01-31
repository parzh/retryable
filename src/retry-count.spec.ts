import retryable from "./retryable";

describe("retry.count", () => {
	it("provides current number of retries so far", async () => {
		const TARGET_VALUE = 10;

		let value = 0;

		const shouldRetry = () => value < TARGET_VALUE;

		await retryable((resolve, reject, retry) => {
			expect(retry.count).toEqual(value);

			value++;

			if (shouldRetry())
				retry();

			else
				resolve();
		});

		expect(value).toEqual(TARGET_VALUE);
	}, 100);

});

describe("retryCount", () => {
	it.todo("is deprecated in favor of `retry.count`");
});
