import type Action from "./typings/action";
import type Retryer from "./typings/retryer";
import assertNatural from "./assert-natural.impl";
import assertNonNegative from "./assert-non-negative.impl";

/** @private */
type Maybe<Value> = Value | null;

/** @private */
const RETRY_COUNT_DEFAULT = 0;

/**
 * Retry action
 * @param action Action to perform an retry if needed
 * @example
 * const content = await retryable((resolve, reject, retry) => {
 *   fs.readfile("/path/to/file", (err, data) => {
 *     if (!err)
 *       return resolve(data);
 *
 *     if (retry.count >= RETRY_LIMIT)
 *       if (SHOULD_IGNORE_RETRY_LIMIT)
 *         retry.setCount(0);
 *
 *       else
 *         return reject("Retry limit reached!");
 *
 *     if (SHOULD_RETRY_IMMEDIATELY)
 *       retry();
 *
 *     else
 *       retry.after("exponential");
 *   });
 * });
 */
export default function retryable<Value = unknown>(action: Action<Value>): Promise<Value> {
	/** @private */
	let _retryCount: number = RETRY_COUNT_DEFAULT;

	/** @private */
	let _nextRetryCount: Maybe<number> = null;

	/** @private */
	let _retryTimeoutId: Maybe<NodeJS.Timer> = null;

	/** @private */
	function updateRetryCount(): void {
		if (_nextRetryCount != null) {
			_retryCount = _nextRetryCount;
			_nextRetryCount = null;
		} else {
			_retryCount += 1;
		}
	}

	function resetRetryCount(argumentRequired: boolean, retryCountExplicit = RETRY_COUNT_DEFAULT): void {
		if (!argumentRequired)
			retryCountExplicit = retryCountExplicit ?? RETRY_COUNT_DEFAULT;

		if (retryCountExplicit !== RETRY_COUNT_DEFAULT)
			assertNatural(retryCountExplicit, "new value of retryCount");

		_nextRetryCount = retryCountExplicit;
	}

	return new Promise<Value>((resolve, reject) => {
		/** @private */
		function execute(): void {
			action(
				resolve,
				reject,
				// explicitly relying on hoisting here
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				retry as Retryer,

				// arguments below are deprecated,
				// left for backwards compatibility

				_retryCount,
				resetRetryCount.bind(null, false),
			);
		}

		function retry(): void {
			updateRetryCount();
			execute();
		}

		function retryAfter(msec: number): void {
			assertNonNegative(msec, "retry delay");
			_retryTimeoutId = setTimeout(retry, msec);
		}

		function retryCancel(): void {
			if (_retryTimeoutId != null)
				clearTimeout(_retryTimeoutId);
		}

		Object.defineProperty(retry, "count", {
			get(): number {
				return _retryCount;
			},

			set(): never {
				return reject("Cannot set readonly `count`; use `retry.setCount()` instead") as never;
			},
		});

		retry.after = retryAfter;

		retry.setCount = resetRetryCount.bind(null, true);

		retry.cancel = retryCancel;

		execute();
	});
}
