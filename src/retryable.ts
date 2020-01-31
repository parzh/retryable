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
 * const content = await retryable((resolve, reject, retry, retryCount) => {
 * 	if (!fs.existsSync("/path/to/file"))
 * 		reject("File not found!");
 *
 * 	else fs.readfile("/path/to/file", (err, data) => {
 * 		if (!err)
 * 			resolve(data);
 *
 * 		else if (retryCount >= MAX_RETRY_COUNT)
 * 			reject("Max retry count reached!");
 *
 * 		else
 * 			retry();
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
