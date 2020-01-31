import { valuer } from "@valuer/main";
import Action from "./typings/action";

/** @private */
const RETRY_COUNT_DEFAULT = 0;

/** @private */
const assertNatural = valuer.as<number>("primitive", "non-negative", "integer");

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
 *         retry.resetCount();
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
	let resettingRetryCountTo: number | null = null;

	function resetRetryCount(retryCountExplicit = RETRY_COUNT_DEFAULT): void {
		if (retryCountExplicit !== RETRY_COUNT_DEFAULT)
			assertNatural(retryCountExplicit, "new value of retryCount");

		resettingRetryCountTo = retryCountExplicit;
	}

	return new Promise<Value>((resolve, reject) => {
		/** @private */
		function execute() {
			action(
				resolve,
				reject,
				retry,

				/** @deprecated Use `count` property of the `retry` argument */
				retry.count,

				/** @deprecated Use `setCount` property of the `retry` argument */
				retry.resetCount,
			);
		}

		/** @private */
		function updateRetryCount() {
			if (resettingRetryCountTo != null) {
				retry.count = resettingRetryCountTo;
				resettingRetryCountTo = null;
			} else {
				retry.count += 1;
			}
		}

		function retry() {
			updateRetryCount();
			execute();
		}

		retry.count = RETRY_COUNT_DEFAULT;
		retry.setCount = resetRetryCount;

		/** @deprecated Use `retry.setCount` */
		retry.resetCount = resetRetryCount;

		execute();
	});
}
