import retryable from "../src/retryable";
import { TIMEOUT_MARGIN, WAIT_TIME, SECOND } from "./helpers/time";

describe("retry.cancel()", () => {
    it("allows to cancel planned retryable action", async () => {
        let value = 0;

        await retryable((resolve, reject, retry) => {
            if(value === 0)
                setTimeout(resolve, SECOND);

            value++

            retry.after(WAIT_TIME);
            retry.cancel();
        });
        
        expect(value).toEqual(1);
    }, TIMEOUT_MARGIN + SECOND)
})