// @ts-check
const module_ = require("..");

describe("CommonJS tests", () => {
	describe('const { retryable } = require("@parzh/retryable")', () => {
		it("imports the `retryable` function itself", () => {
			expect(typeof module_.retryable).toBe("function");
		});

		it("without importing the whole module", () => {
			// @ts-ignore
			const subject = retryable.wait;

			expect(subject).toBeUndefined();
		});
	});

	describe('const { wait } = require("@parzh/retryable")', () => {
		it("imports the `wait` function itself", () => {
			expect(typeof module_.wait).toBe("function");
		});
	});
});
