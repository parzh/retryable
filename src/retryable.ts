import type Action from "./typings/action";
import type Retryer from "./typings/retryer";
import type { RetryerProps } from "./typings/retryer";

import assertNatural from "./assert-natural.impl";
import assertNonNegative from "./assert-non-negative.impl";
import delays, { isNamed } from "./delays";

/** @private */
type Maybe<Value> = Value | null | undefined;

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
	let _retryTimeoutId: Maybe<NodeJS.Timer>;

	let _retryCount: number = RETRY_COUNT_DEFAULT;
	let _nextRetryCount: Maybe<number>;

	let _maxRetryCount = Infinity;
	let _maxRetryCountSet = false; // set by user that is
	let _onMaxRetryCountExceeded: Maybe<() => unknown>;

	let _resolved = false;
	let _rejected = false;

	function updateRetryCount(): void {
		if (_nextRetryCount != null) {
			_retryCount = _nextRetryCount;
			_nextRetryCount = null;
		} else {
			_retryCount += 1;
		}
	}

	function resetRetryCount(argumentRequired: boolean, retryCountExplicit = RETRY_COUNT_DEFAULT): void {
		if (!argumentRequired && retryCountExplicit == null)
			retryCountExplicit = RETRY_COUNT_DEFAULT;

		if (retryCountExplicit !== RETRY_COUNT_DEFAULT)
			assertNatural(retryCountExplicit, "new value of retry.count");

		_nextRetryCount = retryCountExplicit;
	}

	return new Promise<Value>((res, rej) => {
		const resolve: typeof res = (...args) => {
			_resolved = true;
			res(...args);
		};

		const reject: typeof rej = (...args) => {
			_rejected = true;
			rej(...args);
		};

		const retry: Retryer = Object.assign(() => {
			updateRetryCount();

			if (_retryCount > _maxRetryCount)
				if (_onMaxRetryCountExceeded)
					_onMaxRetryCountExceeded();

				else
					return reject(`Retry limit exceeded after ${ _maxRetryCount } retries (${ _maxRetryCount + 1 } attempts total)`);

			if (_resolved || _rejected)
				return;

			// explicitly relying on hoisting here
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			execute();
		}, {
			count: _retryCount, // temporary

			setCount: resetRetryCount.bind(null, true),

			setMaxCount(value, onExceeded?) {
				if (_maxRetryCountSet)
					return; // ignore subsequent calls

				assertNatural(value, "max value of retry.count");

				_maxRetryCount = value;
				_maxRetryCountSet = true;

				if (onExceeded == null)
					return;

				if (onExceeded === "resolve")
					_onMaxRetryCountExceeded = resolve;

				else if (onExceeded !== "reject")
					_onMaxRetryCountExceeded = onExceeded;
			},

			after(delay) {
				let msec: number;

				if (isNamed(delay))
					msec = delays[delay](_retryCount);

				else
					msec = +delay;

				assertNonNegative(msec, "retry delay");

				_retryTimeoutId = setTimeout(retry, msec);
			},

			cancel() {
				if (_retryTimeoutId != null)
					clearTimeout(_retryTimeoutId);
			},
		} as RetryerProps);

		Object.defineProperty(retry, "count", {
			get(): number {
				return _retryCount;
			},

			set(): never {
				return reject("Cannot set readonly `count`; use `retry.setCount()` instead") as never;
			},
		});

		function execute(): void {
			action(
				resolve,
				reject,
				retry,

				// arguments below are deprecated,
				// left for backwards compatibility

				_retryCount,
				resetRetryCount.bind(null, false),
			);
		}

		execute();
	});
}
