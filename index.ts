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
