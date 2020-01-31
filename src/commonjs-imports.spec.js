// @ts-check
const module_ = require(".");

describe('const retryable = require("@parzh/retryable")', () => {
	it("imports the whole module", () => {
		expect(module_).toHaveProperty("retryable");
		expect(module_).toHaveProperty("wait");
		expect(module_).toHaveProperty("default");
	});

	it("is callable (delegates to the `retryable` function)", async () => {
		expect(typeof module_).toBe("function");

		const value = await module_((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});
});

describe('const retryable = require("@parzh/retryable").default', () => {
	it("imports the `retryable` function itself", () => {
		expect(typeof module_.default).toBe("function");
	});

	it("without importing the whole module", () => {
		expect(module_.default).not.toHaveProperty("retryable");
		expect(module_.default).not.toHaveProperty("wait");
		expect(module_.default).not.toHaveProperty("default");
	});
});

describe('const { retryable } = require("@parzh/retryable")', () => {
	it("imports the `retryable` function itself", () => {
		expect(typeof module_.retryable).toBe("function");
	});
});

describe('const { wait } = require("@parzh/retryable")', () => {
	it("imports the `wait` function itself", () => {
		expect(typeof module_.wait).toBe("function");
	});
});
