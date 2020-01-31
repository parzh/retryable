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
			await retryable((resolve, reject) => {
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

		await retryable((resolve, reject, retry, retryCount) => {
			expect(retryCount).toEqual(value);

			value++;

			if (shouldRetry())
				retry();

			else
				resolve();
		});

		expect(value).toEqual(TARGET_VALUE);
	}, 100);

	/** @private */
	const RETRIES_BEFORE_RESET = 5;

	it("allows reseting the value of retry count back to the initial one", async () => {
		let didReset = false;

		const lastRetryCount = await retryable<number>((resolve, reject, retry, retryCount, resetRetryCount) => {
			if (didReset)
				resolve(retryCount);

			else if (retryCount < RETRIES_BEFORE_RESET)
				retry();

			else {
				didReset = true;
				resetRetryCount();
				retry();
			}
		});

		expect(lastRetryCount).toBe(0);
		expect(didReset).toBe(true);
	}, 100);

	it("allows explicitly seting the value of retry count", async () => {
		let didReset = false;

		const lastRetryCount = await retryable<number>((resolve, reject, retry, retryCount, resetRetryCount) => {
			if (didReset)
				resolve(retryCount);

			else if (retryCount < RETRIES_BEFORE_RESET)
				retry();

			else {
				didReset = true;
				resetRetryCount(15);
				retry();
			}
		});

		expect(lastRetryCount).toBe(15);
		expect(didReset).toBe(true);
	}, 100);

	it("forbids explicit values of retryCount being negative numbers", async () => {
		try {
			await retryable((resolve, reject, retry, retryCount, resetRetryCount) => {
				resetRetryCount(-14);
			});

			fail("Function did not throw");
		} catch (error) {
			expect(String(error)).toContain("should not be a negative number");
		}
	});

	it("forbids explicit values of retryCount being non-integers", async () => {
		try {
			await retryable((resolve, reject, retry, retryCount, resetRetryCount) => {
				resetRetryCount(42.17);
			});

			fail("Function did not throw");
		} catch (error) {
			expect(String(error)).toContain("is not an integer");
		}
	});
});
