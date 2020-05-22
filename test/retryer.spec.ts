import retryable from "../src/retryable";

describe("retry()", () => {
	it("allows retrying the action", async () => {
		let retried = false;

		await retryable((resolve, reject, retry) => {
			if (!retried) {
				retried = true;
				retry();
			}

			else resolve();
		});
	});
});
