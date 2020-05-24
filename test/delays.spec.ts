import type { DelayNamed } from "../src/delays";
import delays from "../src/delays";

function expectToBeDelay(key: PropertyKey): asserts key is DelayNamed {
	expect(key in delays).toBe(true);
}

describe("delays", () => {
	it("defines set of functions that return delays", () => {
		for (const key in delays) {
			expectToBeDelay(key);
			expect(typeof delays[key]).toBe("function");
			expect(delays[key]).toHaveLength(1);
		}
	});

	it("defines exponential backoff as 'exponential'", () => {
		expect(delays).toHaveProperty("exponential");

		expect(delays.exponential(0)).toEqual(100);
		expect(delays.exponential(1)).toEqual(200);
		expect(delays.exponential(5)).toEqual(3200);
		expect(delays.exponential(42)).toEqual(439804651110400);
	});
});
