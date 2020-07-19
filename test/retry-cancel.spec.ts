import retryable from "../src/retryable";
import { TIMEOUT_MARGIN, WAIT_TIME, SECOND } from "./helpers/time";

const action = jest.fn();

describe("retry.cancel()", () => {
	it("should allow cancelling delayed retry", async () => {
		await retryable((resolve, reject, retry) => {
			action();

			retry.after(WAIT_TIME);
			retry.cancel();
			setTimeout(resolve, SECOND);
		});

		expect(action).toHaveBeenCalledTimes(1);
	}, TIMEOUT_MARGIN + SECOND)
});
