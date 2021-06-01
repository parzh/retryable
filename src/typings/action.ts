import type Resolver from "./resolver";
import type Rejecter from "./rejecter";
import type Retryer from "./retryer";

export default interface Action<Value = unknown> {
	(
		resolve: Resolver<Value>,
		reject: Rejecter,
		retry: Retryer,

		/** @deprecated */
		DEPRECATED__retryCount: number,

		/** @deprecated */
		DEPRECATED__resetRetryCount: (count?: number) => void,
	): unknown;
}
