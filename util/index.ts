export type MapFunction<From, To> = (f: From) => To;
export * from "./predicates";
export * from "./generators";
export * from "./primes";
export { sum, prod, max, Reducer } from "./reducers";

declare global {
  export interface Array<T> {
    last(): T;
  }
}
Array.prototype.last = function <T>(this: T[]): T {
  return this.slice(-1)[0];
};

