# retryable

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
const content = await retryable((resolve, reject, retry, retryCount) => {
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
