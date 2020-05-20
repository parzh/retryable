import assertNonNegative from "./assert-non-negative.impl";

/** @internal */
export default function assertNatural(value: unknown, role = "value"): asserts value is number {
	assertNonNegative(value);

	if (value % 1 !== 0)
		throw new Error(`${ role } is not an integer: ${ value }`);
}
