export default interface Retryer {
	(): void;

	count: number;

	/** @deprecated use `retry.setCount(0)` */
	resetCount(newValue?: number): void;
}
