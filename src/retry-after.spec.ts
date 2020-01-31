import retryable from "./retryable";
import { time, TIMEOUT_MARGIN, SECOND } from "./time-test-helpers";

describe("retry.after()", () => {
	it("allows retrying after a specified delay", async () => {
		let retried = false;

		const finish = time() + time(SECOND);

		await retryable((resolve, reject, retry) => {
			if (retried)
				resolve();

			else {
				retried = true;

				retry.after(SECOND);
			}
		});

		expect(time()).toBeCloseTo(finish);
		expect(retried).toBe(true);
	}, TIMEOUT_MARGIN + SECOND);
});
