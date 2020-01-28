import retryable from "./index";

describe("retryable()", () => {
	it("provides resolver, that works like Promise.resolve()", async () => {
		const value = await retryable((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});

	it("provides rejecter, that works like Promise.reject()", async () => {
		try {
			await retryable((_resolve, reject) => {
				reject("Unexpected error");
			});

			fail("Function did not throw");
		} catch (error) {
			expect(error).toContain("Unexpected error");
		}
	});
});
