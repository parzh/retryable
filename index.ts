/** @private */
type PromiseCallback<MethodName extends "then" | "catch"> = Parameters<Promise<any>[MethodName]>[0];

export interface Retryer {
	(): void;
}

export interface Action {
	(
		resolve: PromiseCallback<"then">,
		reject: PromiseCallback<"catch">,
		retry: Retryer,
		retryCount: number,
	): unknown;
}

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
export default function retryable(action: Action) {
	let retryCount = 0;

	return new Promise((resolve, reject) => {
		function execute() {
			action(resolve, reject, retry, retryCount);
		}

		function retry() {
			++retryCount;
			execute();
		}

		execute();
	});
}
