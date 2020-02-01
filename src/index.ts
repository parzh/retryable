import retryable from "./retryable";
import wait from "./wait";

/** @private */
type RetryableFunction = typeof retryable;

/** @private */
type WaitFunction = typeof wait;

/** @private */
interface RetryableModule extends RetryableFunction {
	retryable: RetryableFunction;
	wait: WaitFunction;
	default: RetryableFunction;
}

/** @private */
const retryableCloned: RetryableFunction = (...args) => retryable(...args);

/** @public */
const _: RetryableModule = Object.assign(retryableCloned, {
	retryable,
	wait,
	default: retryable,
});

export = _;
