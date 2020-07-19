import module_, { retryable, wait } from "../src";
import TypeOf from "./helpers/typeof.type";

describe('import retryable from "@parzh/retryable"', () => {
	it("should import the `retryable` function itself", async () => {
		expect(typeof module_).toBe<TypeOf>("function");

		const value = await module_<42>((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});

	it("should not import the whole module", () => {
		expect(module_).not.toHaveProperty("retryable");
		expect(module_).not.toHaveProperty("wait");
		expect(module_).not.toHaveProperty("default");
	});
});

describe('import { retryable } from "@parzh/retryable"', () => {
	it("should import the `retryable` function itself", async () => {
		expect(typeof retryable).toBe<TypeOf>("function");

		const value = await retryable<42>((resolve) => {
			resolve(42);
		});

		expect(value).toBe(42);
	});

	it("should not import the whole module", () => {
		expect(retryable).not.toHaveProperty("retryable");
		expect(retryable).not.toHaveProperty("wait");
		expect(retryable).not.toHaveProperty("default");
	});
});

describe('import { wait } from "@parzh/retryable"', () => {
	it("should import the `wait` function itself", () => {
		expect(typeof wait).toBe<TypeOf>("function");
	});
});
