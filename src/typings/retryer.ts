// TODO: deprecate the whole separate '/typings' thing,
// export types from main file as much as possible

export default interface Retryer {
	(): void;

	readonly count: number;

	after(delay: import("../delays").Delay): void;

	setCount(newValue: number): void;

	cancel(): void;
}
