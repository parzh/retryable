<p align="center">
  <a href="https://github.com/parzh/retryable/actions?query=workflow%3A%22Test+changes%22">
    <img src="https://github.com/parzh/retryable/workflows/Test%20changes/badge.svg" />
  </a>

  <a href="https://www.npmjs.com/package/@parzh/retryable">
    <img src="https://badge.fury.io/js/%40parzh%2Fretryable.svg" />
  </a>
</p>

# `@parzh/retryable`

Convenience function to retry executing an action, until a desired result is achieved

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

    // here: an error occured

    if (retry.count >= RETRY_LIMIT)
      if (SHOULD_IGNORE_RETRY_LIMIT)
        // retry limit reached, but ignored
        retry.setCount(0);

      else
        // retry limit reached
        return reject("Retry limit reached!");

    // here: retry limit is ignored or not reached

    if (SHOULD_RETRY_IMMEDIATELY)
      // retrying immediately
      retry();

    else
      // retrying after exponential backoff (see https://en.wikipedia.org/wiki/Exponential_backoff)
      retry.after(2 ** retry.count * 100);
  });
});
```
