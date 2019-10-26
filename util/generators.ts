import { Predicate, Reducer, MapFunction, greaterThan } from ".";
import { Fold } from "./reducers";

declare global {
  interface Generator<T, TReturn, TNext> {
    map<To>(f: MapFunction<T, To>): Generator<To, void, TNext>;
    tap(effect: (t: T) => void): Generator<T, void, TNext>;
    flatMap<To>(f: MapFunction<T, Generator<To, unknown, TNext>>): Generator<To, void, TNext>;
    filter(p: Predicate<T>): Generator<T, TReturn, TNext>;
    takeWhile(p: Predicate<T>): Generator<T, void, TNext>;
    reduce<To>(ff: Reducer<T, To>): To | undefined;
    fold<To>(ff: Fold<T, To>, init: To): To;
    foldMap<To>(ff: Fold<T, To>, init: To): Generator<To, void, TNext>;
    first(): T;
    last(): T;
    lastOrDefault(dflt: T): T;
    toArray(): T[];
  }
}

const Generator = Object.getPrototypeOf(function* () { yield; });
const genProto: Generator = Generator.prototype;

genProto.map = function*<T, To>(this: Generator<T, T, unknown>, f: (t: T) => To): Generator<To, void, unknown> {
  for (const v of this) {
    yield f(v);
  }
};
genProto.tap = function*<T>(this: Generator<T, T, unknown>, effect: (v: T) => void): Generator<T, void, unknown> {
  for (const v of this) {
    effect(v);
    yield v;
  }
};

genProto.filter = function*<T>(this: Generator<T, unknown, unknown>, p: Predicate<T>): Generator<T, void, unknown> {
  for (const v of this) {
    if (p(v)) {
      yield v;
    }
  }
};

genProto.first = function <T>(this: Generator<T, unknown, unknown>): T {
  for (const v of this) {
    return v;
  }
  throw Error("Called First on an empty generator");
};

genProto.takeWhile = function* <T>(this: Generator<T, unknown, unknown>, p: Predicate<T>): Generator<T, void, unknown> {
  for (const v of this) {
    if (!p(v)) {
      return;
    }
    yield v;
  }
};

genProto.reduce = function <TFrom, TTo>(this: Generator<TFrom, TFrom, unknown>, ff: Reducer<TFrom, TTo>): TTo | undefined {
  let acc: TTo | undefined;
  for (const v of this) {
    acc = ff(v, acc);
  }
  return acc;
};

genProto.fold = function <TFrom, TTo>(this: Generator<TFrom, TFrom, unknown>, ff: Fold<TFrom, TTo>, init: TTo): TTo {
  let acc = init;
  for (const v of this) {
    acc = ff(v, acc);
  }
  return acc;
};

genProto.foldMap = function* <TFrom, TTo>(this: Generator<TFrom, TFrom, unknown>, ff: Fold<TFrom, TTo>, init: TTo): Generator<TTo, void, unknown> {
  let acc = init;
  for (const v of this) {
    acc = ff(v, acc);
    yield acc;
  }
};

genProto.toArray = function <T>(this: Generator<T, unknown, unknown>): T[] {
  const arr = [];
  for (const v of this) {
    arr.push(v);
  }
  return arr;
};

genProto.last = function <T>(this: Generator<T, unknown, unknown>): T {
  let last;
  for (const v of this) {
    last = v;
  }
  if (last === undefined) {
    throw Error("Called Last on an empty generator");
  } else {
    return last;
  }
};

genProto.lastOrDefault = function <T>(this: Generator<T, unknown, unknown>, dflt: T): T {
  let last = dflt;
  for (const v of this) {
    last = v;
  }
  return last;
};



genProto.flatMap = function* <TFrom, TTo>(
  this: Generator<TFrom, unknown, unknown>,
  f: (v: TFrom) => Generator<TTo, unknown, unknown>): Generator<TTo, void, unknown> {
  for (const v of this) {
    for (const vv of (f(v))) {
      yield vv;
    }
  }
};

export function* zip<T1, T2>(gen1: Generator<T1, void, unknown>, gen2: Generator<T2, void, unknown>): Generator<[T1, T2], unknown, unknown> {
  for (const v of gen1) {
    const { value, done } = gen2.next();
    if (!done && value) {
      yield [v, value];
    } else {
      return;
    }
  }
}

export function* ints(): Generator<number, void, unknown> {
  let i = 0;
  while (true) {
    yield i;
    i++;
  }
}

export function* fromArray<T>(ts: T[]): Generator<T, void, unknown> {
  for (const t of ts) {
    yield t;
  }
}

export const nats = () => ints().filter(greaterThan(0));
// export const ℕ = nats;
