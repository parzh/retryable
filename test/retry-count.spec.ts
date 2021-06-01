import retryable from "../src/retryable";

describe("retry.count", () => {
	it("should provide current number of retries so far", async () => {
		const ATTEMPTS = 10;
		const counts: number[] = [];

		await retryable((resolve, reject, retry) => {
			counts.push(retry.count);

			if (counts.length < ATTEMPTS)
				retry();

			else
				resolve();
		});

		expect(counts).toStrictEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
	});

	it("should be readonly", () => {
		const promise = retryable((resolve, reject, retry) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			retry.count = 42;
		});

		expect(promise).rejects.toMatch("Cannot set readonly");
	});
});

describe("retryCount", () => {
	it.todo("deprecated in favor of `retry.count`");
});
