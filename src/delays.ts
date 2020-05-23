/** @public */
const delays = {
	/*
		Notes to self:
		- beware of returning NaNs and negative numbers
		- number-like strings are forbidden, as in: `delays["100"]()` // ❌
	*/

	/** @see https://en.wikipedia.org/wiki/Exponential_backoff */
	exponential(retryCount: number): number {
		return 2 ** retryCount * 100;
	},
} as const;

export type DelayNamed = keyof typeof delays;
export type Delay = number | DelayNamed;

export default delays;
