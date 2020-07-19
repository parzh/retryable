import retryable = require("../src");
import type TypeOf from "./helpers/typeof.type";

describe('import retryable = require("@parzh/retryable")', () => {
	it("should import the whole module", () => {
		expect(retryable).toHaveProperty("retryable");
		expect(retryable).toHaveProperty("wait");
		expect(retryable).toHaveProperty("default");
	});

	it("should be callable (delegate to the `retryable` function)", async () => {
		expect(typeof retryable).toBe<TypeOf>("function");

		const value = await retryable<42>((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});

	it.todo("looks ugly, but that works without tests");
});
