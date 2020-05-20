import type Resolver from "./resolver";
import type Rejecter from "./rejecter";
import type Retryer from "./retryer";

export default interface Action<Value = unknown> {
	(
		resolve: Resolver<Value>,
		reject: Rejecter,
		retry: Retryer,

		/** @deprecated Use `retry.count` */
		retryCount: number,

		/** @deprecated Use `retry.setCount(0)` */
		resetRetryCount: (msec?: number) => void,
	): unknown;
}
