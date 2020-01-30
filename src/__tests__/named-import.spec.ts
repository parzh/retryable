import { retryable } from "..";
import { wait } from "..";

/** @private */
const ___ = typeof (null as any);

/** @private */
type TypeOf = typeof ___;

describe('import { retryable } from "@parzh/retryable"', () => {
	it("imports the `retryable` function itself", () => {
		expect(typeof retryable).toBe<TypeOf>("function");
	});

	it("without importing the whole module", () => {
		// @ts-ignore
		const subject = retryable.wait;

		expect(subject).toBeUndefined();
	});
});

describe('import { wait } from "@parzh/retryable"', () => {
	it("imports the `wait` function itself", () => {
		expect(typeof wait).toBe<TypeOf>("function");
	});
});
