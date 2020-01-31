import retryable from "./retryable";

describe("resolve()", () => {
	it("works like Promise.resolve()", async () => {
		const value = await retryable((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});
});
