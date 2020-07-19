import retryable from "../src/retryable";

describe("retry()", () => {
	it("should allow retrying the action", async () => {
		let status: "initial" | "retried" | "resolved" | "rejected" = "initial";

		await retryable((resolve, reject, retry) => {
			if (status === "initial") {
				status = "retried";
				return retry();
			}

			if (status === "retried") {
				status = "resolved";
				return resolve();
			}

			// should never happen:
			if (status === "resolved") {
				status = "rejected";
				return reject();
			}
		});

		expect(status).toBe("resolved");
	});
});
