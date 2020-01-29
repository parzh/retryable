export default interface RetryCountResetter {
	(newValue?: number): void;
}
