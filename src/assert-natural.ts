import assertNonNegative from "./assert-non-negative";

export default function assertNatural(value: any, role = "value"): asserts value is number {
	assertNonNegative(value);

	if (value % 1 !== 0)
		throw new Error(`${ role } is not an integer: ${ value }`);
}
