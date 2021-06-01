import assertNonNegative from "./assert-non-negative.impl";

it("should disallow non-numeric values", () => {
	for (const value of [ "hello world", "42", NaN, (() => {}), {} ] as unknown[])
		expect(() => assertNonNegative(value)).toThrow(/^value is/);
});

it("should disallow negative numbers", () => {
	expect(() => assertNonNegative(-42)).toThrow(/^value is negative: -42$/);
});
