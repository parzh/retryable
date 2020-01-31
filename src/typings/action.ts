import Resolver from "./resolver";
import Rejecter from "./rejecter";
import Retryer from "./retryer";

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
