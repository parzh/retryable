/** @internal */
export default function assertNonNegative(value: any, role = "value"): asserts value is number {
	if (typeof value !== "number")
		throw new Error(`${ role } is not a primitive number: ${ value }`);

	if (value < 0)
		throw new Error(`${ role } is negative: ${ value }`);
}
