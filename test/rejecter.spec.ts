import retryable from "../src/retryable";

describe("reject()", () => {
	it("should work like Promise.reject()", async () => {
		const promise = retryable((resolve, reject) => {
			reject("Unexpected error");
		});

		await expect(promise).rejects.toEqual("Unexpected error");
	});
});
