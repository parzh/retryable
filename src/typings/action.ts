import Resolver from "./resolver";
import Rejecter from "./rejecter";
import Retryer from "./retryer";
import RetryCountResetter from "./retry-count-resetter";

export default interface Action<Value = unknown> {
	(
		resolve: Resolver<Value>,
		reject: Rejecter,
		retry: Retryer,

		/** @deprecated */
		retryCount: number,

		/** @deprecated */
		resetRetryCount: RetryCountResetter,
	): unknown;
}
