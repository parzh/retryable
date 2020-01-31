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
const content: Buffer = await retryable<Buffer>((resolve, reject, retry, retryCount, resetRetryCount) => {
	if (!fs.existsSync("/path/to/file"))
		reject("File not found!");

	else fs.readfile("/path/to/file", (err, data) => {
		if (!err)
			resolve(data);

		else if (retryCount >= MAX_RETRY_COUNT)
			reject("Max retry count reached!");

		else
			retry();
	});
});
```
