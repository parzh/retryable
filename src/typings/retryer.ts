export default interface Retryer {
	(): void;

	count: number;
	setCount(newValue: number): void;
}
