import retryable from "../src/retryable";

describe("retry.count", () => {
	it("should provide current number of retries so far", async () => {
		const TARGET_VALUE = 10;

		let value = 0;

		await retryable((resolve, reject, retry) => {
			expect(retry.count).toEqual(value);

			value++;

			if (value < TARGET_VALUE)
				retry();

			else
				resolve();
		});

		expect(value).toEqual(TARGET_VALUE);
	});

	it("should be readonly", () => {
		const promise = retryable((resolve, reject, retry) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			retry.count = 42;
		});

		expect(promise).rejects.toMatch("Cannot set readonly");
	});
});

describe("retryCount", () => {
	it.todo("deprecated in favor of `retry.count`");
});
