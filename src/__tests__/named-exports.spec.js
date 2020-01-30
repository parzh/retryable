// @ts-check
const { retryable } = require("..");
const { wait } = require("..");

describe("CommonJS tests", () => {
	describe('const { retryable } = require("@parzh/retryable")', () => {
		it("imports the `retryable` function itself", () => {
			expect(typeof retryable).toBe("function");
		});
	
		it("without importing the whole module", () => {
			// @ts-ignore
			const subject = retryable.wait;
	
			expect(subject).toBeUndefined();
		});
	});
	
	describe('const { wait } = require("@parzh/retryable")', () => {
		it("imports the `wait` function itself", () => {
			expect(typeof wait).toBe("function");
		});
	});
});
