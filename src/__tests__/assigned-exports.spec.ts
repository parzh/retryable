import retryable = require("..");

/** @private */
const ___ = typeof null;

/** @private */
type TypeOf = typeof ___;

describe('import retryable = require("..")', () => {
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
