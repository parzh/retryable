import module_, { retryable, wait } from "..";

/** @private */
const ___ = typeof null;

/** @private */
type TypeOf = typeof ___;

describe('import retryable from "@parzh/retryable"', () => {
	it("imports the whole module", () => {
		expect(module_).toHaveProperty("retryable");
		expect(module_).toHaveProperty("wait");
		expect(module_).toHaveProperty("default");
	});
	
	it("is callable (delegates to the `retryable` function)", async () => {
		expect(typeof module_).toBe<TypeOf>("function");

		const value = await module_<42>((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});
});

describe('import { retryable } from "@parzh/retryable"', () => {
	it("imports the `retryable` function itself", () => {
		expect(typeof retryable).toBe<TypeOf>("function");
	});

	it("without importing the whole module", () => {
		expect(retryable).not.toHaveProperty("retryable");
		expect(retryable).not.toHaveProperty("wait");
		expect(retryable).not.toHaveProperty("default");
	});
});

describe('import { wait } from "@parzh/retryable"', () => {
	it("imports the `wait` function itself", () => {
		expect(typeof wait).toBe<TypeOf>("function");
	});
});
