/**
 * Wait for a specific amount of time,
 * by creating a promise that resolves
 * after a given number of milliseconds
 * @param {number} msec Number of milliseconds, after which the promise is resolved
 */
export default function wait(msec: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, msec);
	});
}
