import Resolver from "./resolver";
import Rejecter from "./rejecter";
import Retryer from "./retryer";
import RetryCountResetter from "./retry-count-resetter";

export default interface Action {
	(
		resolve: Resolver,
		rejecte: Rejecter,
		retry: Retryer,
		retryCount: number,
		resetRetryCount: RetryCountResetter,
	): unknown;
}
