import type { Delay } from "../delays";

export default interface Retryer {
	(): void;

	readonly count: number;

	after(delay: Delay): void;
	setCount(newValue: number): void;
	cancel(): void;
}
