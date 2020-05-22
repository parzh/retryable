/**
 * Сreate a promise that resolves after a given number of milliseconds
 * @param {number} msec
 */
export default function wait(msec: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, msec ?? 0);
	});
}
