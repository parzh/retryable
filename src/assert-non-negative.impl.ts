/** @internal */
export default function assertNonNegative(value: unknown, role = "value"): asserts value is number {
	if (typeof value !== "number")
		throw new Error(`${ role } is not a primitive number: ${ value }`);

	if (isNaN(value))
		throw new Error(`${ role } is not a number: ${ value }`);

	if (value < 0)
		throw new Error(`${ role } is negative: ${ value }`);
}
