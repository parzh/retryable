import Resolver from "./resolver";
import Rejecter from "./rejecter";
import Retryer from "./retryer";
import RetryCountResetter from "./retry-count-resetter";

export default interface Action<Value = unknown> {
	/**
	 * @param retryCount Deprecated. Use `retry.count`
	 * @param resetRetryCount Deprecated. Use `retry.resetCount`
	 */
	(
		resolve: Resolver<Value>,
		reject: Rejecter,
		retry: Retryer,
		retryCount: number,
		resetRetryCount: RetryCountResetter,
	): unknown;
}
