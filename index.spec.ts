import retryable from "./index";

it("provides resolver, that works like Promise.resolve()", async () => {
	const value = await retryable((resolve) => {
		resolve(42);
	});

	expect(value).toBe(42);
});
