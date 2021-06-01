import assertNonNegative from "./assert-non-negative.impl";
import assertNatural from "./assert-natural.impl";

jest.mock("./assert-non-negative.impl", () => ({
	__esModule: true,
	default: jest.fn(() => {}),
}));

it("should disallow non-integer numbers", () => {
	expect(() => assertNatural(42.17)).toThrow();
	expect(assertNonNegative).toHaveBeenLastCalledWith(42.17);
	expect(assertNonNegative).toHaveBeenCalledTimes(1);
});

it("should show the supplied value role in error message", () => {
	expect(() => assertNatural(42.17, "forty-two-point-seventeen"))
		.toThrow(/^forty-two-point-seventeen is not an integer: 42.17$/);
});
