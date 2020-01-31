import PromiseConstructorParameters from "./.promise-constructor-parameters";

export type ResolverLegacy =
	| PromiseConstructorParameters[0];
	;

export default interface Resolver<Value = unknown> {
	(value?: Value | PromiseLike<Value>): void;
}
