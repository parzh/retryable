import retryable from "../src/retryable";

describe("resolve()", () => {
	it("should work like Promise.resolve()", async () => {
		const value = await retryable((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});
});
