import type { Delay } from "../delays";

export type OnMaxRetryCountExceeded = "resolve" | "reject" | (() => unknown);

export interface RetryerProps {
	/**
	 * Readonly number of retries that occurred so far.
	 * Always 1 less than the number of total attempts.
	 * @example
	 * console.log(retry.count);
	 * // [attempt #1] logs 0
	 * // [attempt #2] logs 1
	 * // [attempt #3] logs 2
	 * // ...
	 *
	 * retry();
	 */
	readonly count: number;

	/**
	 * Set value of `retry.count` for the next attempt
	 * @example
	 * retry.setCount(42);
	 *
	 * console.log(retry.count);
	 * // [attempt #1] logs 0
	 * // [attempt #2] logs 42
	 * // [attempt #3] logs 42
	 * // ...
	 *
	 * retry();
	 */
	setCount(newValue: number): void;

	/**
	 * Set upper limit for the value of `retry.count`
	 * @param value Value of `retry.count`
	 * @param onExceeded (defaults to `"reject"`) Limit exceed action
	 * @example
	 * retry.setMaxCount(0);
	 * retry.setMaxCount(0, "reject");
	 * // [attempt #1] reject with "Retry limit exceeded …"
	 *
	 * retry.setMaxCount(1);
	 * // [attempt #1] retry
	 * // [attempt #2] reject with "Retry limit exceeded …"
	 *
	 * retry.setMaxCount(1, "resolve");
	 * retry.setMaxCount(1, resolve);
	 * // [attempt #1] retry
	 * // [attempt #2] resolve to `undefined`
	 *
	 * retry.setMaxCount(1, () => resolve(42));
	 * // [attempt #1] retry
	 * // [attempt #2] resolve to `42`
	 *
	 * retry.setMaxCount(1, () => retry.setCount(0));
	 * // [attempt #1] retry
	 * // [attempt #2] retry (update count)
	 * // [attempt #3] retry
	 * // [attempt #4] retry (update count)
	 * // [attempt #5] retry
	 * // ...
	 *
	 * retry.setMaxCount(1, () => retry.setCount(1));
	 * // [attempt #1] retry
	 * // [attempt #2] retry (update count)
	 * // [attempt #3] retry (update count)
	 * // [attempt #4] retry (update count)
	 * // [attempt #5] retry (update count)
	 * // ...
	 */
	setMaxCount(value: number, onExceeded?: OnMaxRetryCountExceeded): void;

	/**
	 * Delays retry(s) by a given strategy or timer
	 * @param delay The delay
	 * @example
	 * retry.after(300);
	 * // retry after 300 milliseconds
	 *
	 * retry.after(1000);
	 * // retry after 1 second
	 *
	 * retry.after("exponential");
	 * // use "Exponential backoff" retry strategy
	 *
	 * retry.after(0);
	 * // retry asynchronously
	 */
	after(delay: Delay): void;

	/**
	 * Cancel the delayed retry
	 * @example
	 * retry.after(1000); // won't retry
	 * retry.cancel();
	 */
	cancel(): void;
}

export default interface Retryer extends RetryerProps {
	(): void;
}
