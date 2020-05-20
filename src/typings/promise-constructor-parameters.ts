/** @public */
type PromiseConstructorParameters =
	| Parameters<ConstructorParameters<PromiseConstructor>[0]>
	;

export default PromiseConstructorParameters;
