import Resolver from "./resolver";
import Rejecter from "./rejecter";
import Retryer from "./retryer";
import RetryCountResetter from "./retry-count-resetter";

export default interface Action<Value = unknown> {
	(
		resolve: Resolver<Value>,
		rejecte: Rejecter,
		retry: Retryer,
		retryCount: number,
		resetRetryCount: RetryCountResetter,
	): unknown;
}
