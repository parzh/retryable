export default interface Retryer {
	(): void;

	count: number;
	resetCount(newValue?: number): void;
}
