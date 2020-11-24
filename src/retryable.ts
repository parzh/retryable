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
	const retryCount = {
		value: RETRY_COUNT_DEFAULT,
		next: null as Maybe<number>,

		updateValue(): void {
			if (retryCount.next != null) {
				retryCount.value = retryCount.next;
				retryCount.next = null;
			} else {
				retryCount.value += 1;
			}
		},

		setNext(newNext: number): void {
			if (newNext !== RETRY_COUNT_DEFAULT)
				assertNatural(newNext, "new value of retry.count");

			retryCount.next = newNext;
		},

		/** @deprecated Use `retryCount.setNext(:number)` */
		reset(count?: number): void {
			retryCount.setNext(count ?? RETRY_COUNT_DEFAULT);
		},

		/** @namespace */
		max: {
			value: Infinity,
			customized: false,
			onExceeded: null as Maybe<() => unknown>,

			get exceededMessage(): string {
				return `Retry limit exceeded after ${ this.value } retries (${ this.value + 1 } attempts total)`;
			},
		},
	};

	let _retryTimeoutId: Maybe<NodeJS.Timer>;
	let _settled = false;

	return new Promise<Value>((res, rej) => {
		const resolve: typeof res = (...args) => {
			_settled = true;
			res(...args);
		};

		const reject: typeof rej = (...args) => {
			_settled = true;
			rej(...args);
		};

		const retry: Retryer = Object.assign(() => {
			retryCount.updateValue();

			if (retryCount.value > retryCount.max.value)
				if (retryCount.max.onExceeded != null)
					retryCount.max.onExceeded();

				else
					return reject(retryCount.max.exceededMessage);

			if (_settled)
				return;

			// explicitly relying on hoisting here
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			execute();
		}, {
			count: retryCount.value, // temporary

			setCount: retryCount.setNext,

			setMaxCount(value, onExceeded?) {
				// ignore subsequent calls
				if (retryCount.max.customized)
					return;

				assertNatural(value, "max value of retry.count");

				retryCount.max.value = value;
				retryCount.max.customized = true;

				if (onExceeded == null || onExceeded === "reject")
					return;

				if (onExceeded === "resolve")
					retryCount.max.onExceeded = resolve;

				else
					retryCount.max.onExceeded = onExceeded;
			},

			after(delay) {
				let msec: number;

				if (isNamed(delay))
					msec = delays[delay](retryCount.value);

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
				return retryCount.value;
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

				retryCount.value,
				retryCount.reset,
			);
		}

		execute();
	});
}
