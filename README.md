<p align="center">
	<a href="https://github.com/parzh/retryable/actions?query=workflow%3A%22Test+changes%22">
		<img src="https://github.com/parzh/retryable/workflows/Test%20changes/badge.svg" />
	</a>
</p>

# @parzh/retryable

Convenience function to retry executing an action, untill a desired result is achieved

## Installation

```
npm i @parzh/retryable
```

```
yarn add @parzh/retryable
```

## Usage

```js
const content = await retryable((resolve, reject, retry) => {
  fs.readfile("/path/to/file", (err, data) => {
    if (!err)
      // no errors occured
      return resolve(data);

    // otherwise: an error occured

    if (retry.count >= RETRY_LIMIT)
      if (SHOULD_IGNORE_RETRY_LIMIT)
        // retry limit reached
        // retry limit is ignored
        retry.setCount(0);

      else
        // retry limit reached
        // retry limit is respected
        return reject("Retry limit reached!");

    // otherwise: retry limit is not reached or ignored

    if (SHOULD_RETRY_IMMEDIATELY)
      // retrying immediately
      retry();

    else
      // retrying after {2^retries × 100} milliseconds
      retry.after(2 ** retry.count * 100);
  });
});
```
