import retryable from "../src/retryable";
import { TIMEOUT_MARGIN } from "./helpers/time";

describe("retry.count", () => {
	it("provides current number of retries so far", async () => {
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
	}, TIMEOUT_MARGIN);

	it("is a readonly value", () => {
		const promise = retryable((resolve, reject, retry) => {
			// @ts-ignore
			retry.count = 42;
		});

		expect(promise).rejects.toMatch("Cannot set readonly");
	});
});

describe("retryCount", () => {
	it.todo("is deprecated in favor of `retry.count`");
});
