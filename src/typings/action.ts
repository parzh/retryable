import type Resolver from "./resolver";
import type Rejecter from "./rejecter";
import type Retryer from "./retryer";

export default interface Action<Value = unknown> {
	(
		resolve: Resolver<Value>,
		reject: Rejecter,
		retry: Retryer,

		// eslint-disable-next-line @typescript-eslint/camelcase
		DEPRECATED__retryCount: number,

		// eslint-disable-next-line @typescript-eslint/camelcase
		DEPRECATED__resetRetryCount: (count?: number) => void,
	): unknown;
}
