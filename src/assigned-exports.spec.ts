import retryable = require(".");
import TypeOf from "./typeof.type";

describe('import retryable = require("@parzh/retryable")', () => {
	it("imports the whole module", () => {
		expect(retryable).toHaveProperty("retryable");
		expect(retryable).toHaveProperty("wait");
		expect(retryable).toHaveProperty("default");
	});

	it("is callable (delegates to the `retryable` function)", async () => {
		expect(typeof retryable).toBe<TypeOf>("function");

		const value = await retryable<42>((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});

	it.todo("and looks ugly, but that works without tests");
});
