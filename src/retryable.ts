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
 * 	fs.readfile("/path/to/file", (err, data) => {
 * 		if (!err)
 * 			// no errors occured
 * 			return resolve(data);
 * 
 * 		if (retry.count >= MAX_RETRY_COUNT)
 * 			if (SHOULD_IGNORE_RETRY_LIMIT)
 * 				// an error occured
 * 				// retry limit reached
 * 				// retry limit is ignored
 * 				retry.resetCount();
 *
 * 			else 
 * 				// an error occured
 * 				// retry limit reached
 * 				// retry limit is respected
 * 				return reject("Max retry count reached!");
 *
 * 		if (SHOULD_RETRY_IMMEDIATELY)
 * 			// an error occured
 * 			// retry limit is not reached or ignored
 * 			// retrying immediately
 * 			retry();
 *
 * 		else
 * 			// an error occured
 * 			// retry limit is not reached or ignored
 * 			// retrying after 2^retries × 100 milliseconds
 * 			retry.after(2 ** retry.count * 100);
 * 	});
 * });
 */
export default function retryable<Value = unknown>(action: Action<Value>): Promise<Value> {
	let retryCount = RETRY_COUNT_DEFAULT;
	let resettingRetryCountTo: number | null = null;

	function resetRetryCount(retryCountExplicit = RETRY_COUNT_DEFAULT): void {
		if (retryCountExplicit !== RETRY_COUNT_DEFAULT)
			assertNatural(retryCountExplicit, "new value of retryCount");

		resettingRetryCountTo = retryCountExplicit;
	}

	/** @private */
	function updateRetryCount() {
		if (resettingRetryCountTo != null) {
			retryCount = resettingRetryCountTo;
			resettingRetryCountTo = null;
		} else {
			retryCount += 1;
		}
	}

	return new Promise<Value>((resolve, reject) => {
		function execute() {
			action(
				resolve,
				reject,
				retry,
				retryCount,
				resetRetryCount,
			);
		}

		function retry() {
			updateRetryCount();
			execute();
		}

		execute();
	});
}
