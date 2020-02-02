import PromiseConstructorParameters from "./promise-constructor-parameters";

/** @deprecated Consider using `Resolver<unknown>` instead */
export type ResolverLegacy =
	| PromiseConstructorParameters[0]
	;

export default interface Resolver<Value = unknown> {
	(value?: Value | PromiseLike<Value>): void;
}
