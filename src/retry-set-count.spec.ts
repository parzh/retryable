import retryable from "./retryable";
import { TIMEOUT_MARGIN } from "./time-test-helpers";

/** @private */
const RETRIES_BEFORE_RESET = 5;

describe("retry.setCount()", () => {
	it("allows explicitly seting the value of retry count", async () => {
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
	}, TIMEOUT_MARGIN);

	it("forbids explicit values of retryCount being negative numbers", async () => {
		try {
			await retryable((resolve, reject, retry) => {
				retry.setCount(-14);
			});

			fail("Function did not throw");
		} catch (error) {
			expect(error.message).toContain("a negative number");
		}
	});

	it("forbids explicit values of retryCount being non-integers", async () => {
		try {
			await retryable((resolve, reject, retry) => {
				retry.setCount(42.17);
			});

			fail("Function did not throw");
		} catch (error) {
			expect(error.message).toContain("not an integer");
		}
	});
});

describe("retry.resetCount()", () => {
	it.todo("is deprecated in favor of `retry.setCount(0)`");
});

describe("resetRetryCount()", () => {
	it.todo("is deprecated in favor of `retry.setCount(0)`");
});
