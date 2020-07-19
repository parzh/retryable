/** @deprecated Use `Retryer["setCount"]` from _/typings/retryer.ts_ instead */
export default interface RetryCountResetter {
	(newValue?: number): void;
}
