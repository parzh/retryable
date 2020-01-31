import retryable from "../src/retryable";

describe("reject()", () => {
	it("works like Promise.reject()", async () => {
		try {
			await retryable((resolve, reject) => {
				reject("Unexpected error");
			});

			fail("Function did not throw");
		} catch (error) {
			expect(error).toContain("Unexpected error");
		}
	});
});
