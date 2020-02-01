import { valuer } from "@valuer/main";
import Action from "./typings/action";
import Retryer from "./typings/retryer";

/** @private */
interface Private {
	retryCount: number;
	resettingRetryCountTo: number | null;
}

/** @private */
const RETRY_COUNT_DEFAULT = 0;

/** @private */
const assert = {
	natural: valuer.as<number>("primitive", "non-negative", "integer"),
	nonNegative: valuer.as<number>("primitive", "non-negative"),
};

/**
 * Retry action
 * @param action Action to perform an retry if needed
 * @example
 * const content = await retryable((resolve, reject, retry) => {
 *   fs.readfile("/path/to/file", (err, data) => {
 *     if (!err)
 *       // no errors occured
 *       return resolve(data);
 *
 *     // Here: an error occured
 *
 *     if (retry.count >= RETRY_LIMIT)
 *       if (SHOULD_IGNORE_RETRY_LIMIT)
 *         // retry limit reached
 *         // retry limit is ignored
 *         retry.setCount(0);
 *
 *       else
 *         // retry limit reached
 *         // retry limit is respected
 *         return reject("Retry limit reached!");
 *
 *     // Here: retry limit is not reached or ignored
 *
 *     if (SHOULD_RETRY_IMMEDIATELY)
 *       // retrying immediately
 *       retry();
 *
 *     else
 *       // retrying after {2^retries × 100} milliseconds
 *       retry.after(2 ** retry.count * 100);
 *   });
 * });
 */
export default function retryable<Value = unknown>(action: Action<Value>): Promise<Value> {
	/** @private */
	const __: Private = {
		retryCount: RETRY_COUNT_DEFAULT,
		resettingRetryCountTo: null,
	};

	function resetRetryCount(argumentRequired: boolean, retryCountExplicit = RETRY_COUNT_DEFAULT): void {
		if (!argumentRequired)
			retryCountExplicit = retryCountExplicit ?? RETRY_COUNT_DEFAULT;

		if (retryCountExplicit !== RETRY_COUNT_DEFAULT)
			assert.natural(retryCountExplicit, "new value of retryCount");

		__.resettingRetryCountTo = retryCountExplicit;
	}

	return new Promise<Value>((resolve, reject) => {
		/** @private */
		function execute() {
			action(
				resolve,
				reject,
				retry as Retryer,

				/** @deprecated Use `count` property of the `retry` argument */
				__.retryCount,

				/** @deprecated Use `setCount` property of the `retry` argument */
				resetRetryCount.bind(null, false),
			);
		}

		/** @private */
		function updateRetryCount() {
			if (__.resettingRetryCountTo != null) {
				__.retryCount = __.resettingRetryCountTo;
				__.resettingRetryCountTo = null;
			} else {
				__.retryCount += 1;
			}
		}

		function retry() {
			updateRetryCount();
			execute();
		}

		function retryAfter(delay: number): void {
			assert.nonNegative(delay, "retry delay");
			setTimeout(retry, delay);
		}

		Object.defineProperty(retry, "count", {
			get(): number {
				return __.retryCount;
			},

			set(): never {
				return reject("Cannot set readonly `count`; use `retry.setCount()` instead") as never;
			},
		});

		retry.after = retryAfter;

		retry.setCount = resetRetryCount.bind(null, true);

		execute();
	});
}
