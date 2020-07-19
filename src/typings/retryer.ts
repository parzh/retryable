import type { Delay } from "../delays";

export default interface Retryer {
	(): void;

	/**
	 * Readonly number of retries that occurred so far.
	 * Always 1 less than the number of total attempts.
	 * @example
	 * console.log(retry.count);
	 * // [iteration #1] logs 0
	 * // [iteration #2] logs 1
	 * // [iteration #3] logs 2
	 * // ...
	 *
	 * retry();
	 */
	readonly count: number;

	/**
	 * Set value of `retry.count` for the next iteration
	 * @example
	 * retry.setCount(42);
	 *
	 * console.log(retry.count);
	 * // [iteration #1] logs 0
	 * // [iteration #2] logs 42
	 * // [iteration #3] logs 42
	 * // ...
	 *
	 * retry();
	 */
	setCount(newValue: number): void;

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
	 * retry.after(1000); // doesn't work
	 * retry.cancel();
	 */
	cancel(): void;
}
