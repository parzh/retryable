import retryable from "./retryable";
import { TIMEOUT_MARGIN } from "./time-test-helpers";

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
	}, TIMEOUT_MARGIN);
});
