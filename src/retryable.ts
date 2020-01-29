import Action from "./typings/action";

/** @private */
const RETRY_COUNT_DEFAULT = 0;

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
export default function retryable<Value>(action: Action): Promise<Value> {
	let retryCount = RETRY_COUNT_DEFAULT;

	function resetRetryCount(retryCountNew = RETRY_COUNT_DEFAULT): void {
		retryCount = retryCountNew;
	}

	return new Promise((resolve, reject) => {
		function execute() {
			action(
				// @ts-ignore
				// FIXME: cannot use type-checking here
				// due to TypeScript design limitations
				// see https://github.com/microsoft/TypeScript/issues/32254
				resolve,
				reject,
				retry,
				retryCount,
				resetRetryCount,
			);
		}

		function retry() {
			++retryCount;
			execute();
		}

		execute();
	});
}
