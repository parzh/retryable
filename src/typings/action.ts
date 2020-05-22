import type Resolver from "./resolver";
import type Rejecter from "./rejecter";
import type Retryer from "./retryer";

export default interface Action<Value = unknown> {
	(
		resolve: Resolver<Value>,
		reject: Rejecter,
		retry: Retryer,

		/** @deprecated Use `retry.count` */
		// eslint-disable-next-line @typescript-eslint/camelcase
		DEPRECATED__retryCount: number,

		/** @deprecated Use `retry.setCount(0)` */
		// eslint-disable-next-line @typescript-eslint/camelcase
		DEPRECATED__resetRetryCount: (count?: number) => void,
	): unknown;
}
