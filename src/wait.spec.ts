import wait from "./wait";

it("resolves after the specified amount of time", async () => {
	const start = Date.now();
	const finish = start + 1000;

	await wait(1000);

	expect(Date.now()).toBeCloseTo(finish);
}, 1100);
