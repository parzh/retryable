export default interface Retryer {
	(): void;

	count: number;

	setCount(newValue: number): void;

	/** @deprecated use `retry.setCount(0)` */
	resetCount(newValue?: number): void;
}
