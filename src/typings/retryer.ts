export default interface Retryer {
	(): void;

	readonly count: number;

	after(msec: number): void;

	setCount(newValue: number): void;

	retryCancel(): void;
}
