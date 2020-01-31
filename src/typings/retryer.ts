export default interface Retryer {
	(): void;

	readonly count: number;

	after(msec: number): void;

	setCount(newValue: number): void;

	/** @deprecated use `retry.setCount(0)` */
	resetCount(newValue?: number): void;
}
