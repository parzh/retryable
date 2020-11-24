import retryable from "../src/retryable";

const action = jest.fn();

describe("retry.setMaxCount()", () => {
	test.each([
		[ "negative numbers", -4, "is negative" ],
		[ "non-integers", 42.17, "not an integer" ],
		[ "NaNs", NaN, "is not a number" ],
	])("should forbid %s", async (name, value, error) => {
		const promise = retryable((resolve, reject, retry) => {
			retry.setMaxCount(value);
		});

		await expect(promise).rejects.toThrowError(error);
	});

	test.each([
		[ "implicitly", [ ] ],
		[ "explicitly", [ "reject" ] ],
	] as const)("should reject (%s), if retry count exceeded", async (how, [ onExceeded ]) => {
		const promise = retryable((resolve, reject, retry) => {
			retry.setMaxCount(5, onExceeded);
			action();
			retry();
		});

		await expect(promise).rejects.toEqual(
			"Retry limit exceeded after 5 retries (6 attempts total)",
		);

		expect(action).toHaveBeenCalledTimes(6);
	});

	it("should allow resolving to `undefined`", async () => {
		const promise = retryable((resolve, reject, retry) => {
			retry.setMaxCount(5, "resolve");
			action();
			retry();
		});

		await expect(promise).resolves.toBeUndefined();

		expect(action).toHaveBeenCalledTimes(6);
	});

	it("should allow providing custom action", async () => {
		const promise = retryable((resolve, reject, retry) => {
			retry.setMaxCount(5, () => resolve(42));
			action();
			retry();
		});

		await expect(promise).resolves.toEqual(42);

		expect(action).toHaveBeenCalledTimes(6);
	});

	it("should ignore subsequent invocations", async () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const assertNaturalModule = require("../src/assert-natural.impl");

		jest.spyOn(assertNaturalModule, "default");

		await retryable((resolve, reject, retry) => {
			retry.setMaxCount(42);
			retry.setMaxCount(17); // ignored
			retry.setMaxCount(56); // ignored
			retry.setMaxCount(Infinity); // ignored
			retry.setMaxCount(NaN); // ignored
			resolve();
		});

		expect(assertNaturalModule.default).toHaveBeenNthCalledWith(1, 42, "max value of retry.count");
		expect(assertNaturalModule.default).toHaveBeenCalledTimes(1);
	});
});
