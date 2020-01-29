import Resolver from "./resolver";
import Rejecter from "./rejecter";
import Retryer from "./retryer";

export default interface Action {
	(
		resolve: Resolver,
		rejecte: Rejecter,
		retry: Retryer,
		retryCount: number,
	): unknown;
}
