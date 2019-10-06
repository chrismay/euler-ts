type FoldFunction<TFrom, TTo> = (v: TFrom, acc?: TTo) => TTo;
type Predicate<T> = (v: T) => boolean;
type MapFunction<From, To> = (f: From) => To;


interface Array<T> {
  last(): T;
}

Array.prototype.last = function <T>(this: T[]): T {
  return this.slice(-1)[0];
};

// #region generator
interface Generator<T, TReturn, TNext> {
  map<To>(f: MapFunction<T, To>): Generator<To, void, TNext>;
  flatMap<To>(f: MapFunction<T, Generator<To, unknown, TNext>>): Generator<To, void, TNext>;
  filter(p: Predicate<T>): Generator<T, TReturn, TNext>;
  takeWhile(p: Predicate<T>): Generator<T, void, TNext>;
  fold<To>(ff: FoldFunction<T, To>, init: To): To;
  reduce<To>(ff: FoldFunction<T, To>): To | undefined;
  first(): T;
  last(): T;
  toArray(): T[];
}

const Generator = Object.getPrototypeOf(function* () { yield; });
const genProto: Generator = Generator.prototype;

genProto.map = function*<T, To>(this: Generator<T, T, unknown>, f: (t: T) => To): Generator<To, void, unknown> {
  for (const v of this) {
    yield f(v);
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
      yield v;
      return;
    }
    yield v;
  }
};

genProto.fold = function <TFrom, TTo>(this: Generator<TFrom, TFrom, unknown>, ff: FoldFunction<TFrom, TTo>, init: TTo): TTo {
  let acc = init;
  for (const v of this) {
    acc = ff(v, acc);
  }
  return acc;
};

genProto.reduce = function <TFrom, TTo>(this: Generator<TFrom, TFrom, unknown>, ff: FoldFunction<TFrom, TTo>): TTo | undefined {
  let acc: TTo | undefined;
  for (const v of this) {
    acc = ff(v, acc);
  }
  return acc;
};

genProto.toArray = function <T>(this: Generator<T, unknown, unknown>): T[] {
  const arr = [];
  for (const v of this) {
    arr.push(v);
  }
  return arr;
}

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

genProto.flatMap = function* <TFrom, TTo>(
  this: Generator<TFrom, unknown, unknown>,
  f: (v: TFrom) => Generator<TTo, unknown, unknown>): Generator<TTo, void, unknown> {
  for (const v of this) {
    for (const vv of (f(v))) {
      yield vv;
    }
  }
}
// #endregion

function* zip<T1, T2>(gen1: Generator<T1, void, unknown>, gen2: Generator<T2, void, unknown>): Generator<[T1, T2], unknown, unknown> {
  for (const v of gen1) {
    const { value, done } = gen2.next();
    if (!done && value) {
      yield [v, value];
    } else {
      return;
    }
  }
}

function* ints(): Generator<number, void, unknown> {
  let i = 0;
  while (true) {
    yield i;
    i++;
  }
}

const sum: FoldFunction<number, number> = (a, b) => a + (b ? b : 0);
const prod: FoldFunction<number, number> = (a: number, b?: number) => a * (b ? b : 1);
const square: (x: number) => number = x => x * x;

const lessThan:  (lim: number) => Predicate<number> = lim => x => x < lim;
const greaterThan: (lim: number) => Predicate<number> = lim => x => x > lim;

const max: FoldFunction<number, number> = function (test: number, current?: number): number {
  if (current) {
    if (test > current) {
      return test;
    } else {
      return current;
    }
  } else {
    return test;
  }
}

const nats = () => ints().filter(greaterThan(0));

function* primes(): Generator<number, void, unknown> {
  let prev = 1;
  const primes: number[] = [];
  function notprime(x: number) {
    return primes.find(p => x % p === 0);
  }
  while (true) {
    prev = prev + 1;
    while (notprime(prev)) {
      prev = prev + 1;
    }
    primes.push(prev);
    yield prev;
  }
}

function ex1() {
  const isDivisible = (x: number) => x % 3 === 0 || x % 5 === 0;

  console.log(
    "Ex1:",
    ints()
      .filter(isDivisible)
      .takeWhile(x => x < 1000)
      .reduce(sum)
  );
}

function ex2() {
  function fibsTo(limit: number) {
    function fib(limit: number, acc: number[]): number[] {
      const [a, b] = acc.slice(-2);
      if (b >= limit) {
        return acc;
      }
      return fib(limit, [...acc, a + b]);
    }
    return fib(limit, [1, 2]);
  }

  const isEven: Predicate<number> = x => x % 2 === 0;

  console.log(
    "Ex2:",
    fibsTo(4000000)
      .filter(isEven)
      .reduce(sum)
  );
}

function ex3() {
  function nextprime(above: number, primes: number[]): number {
    function notprime(x: number) {
      return primes.find(p => x % p === 0);
    }
    let next = above + 1;
    while (notprime(next)) {
      next = next + 1;
    }
    return next;
  }

  function factors(n: number) {
    const max = Math.ceil(Math.sqrt(n));

    const factors = [];
    let p = 2;
    let rem = n;
    while (p <= max) {
      if (rem % p === 0) {
        factors.push(p);
        while (rem % p === 0) {
          rem = rem / p;
        }
      }
      p = nextprime(p, factors);
    }
    return factors;
  }
  //  console.log("Ex3:", factors(2520).last());
  console.log("Ex3:", factors(600851475143).slice(-1)[0]);
}

function ex4() {
  function reverseString(str: string) {
    return str
      .split("")
      .reverse()
      .join("");
  }
  const threedigits = () =>
    ints()
      .filter(x => x > 99)
      .takeWhile(x => x < 1000);

  const palindromic: Predicate<number> = x => "" + x === reverseString("" + x);

  const combine =
    (x: number) => threedigits().map(n => n * x);

  console.log(
    "Ex4:",
    threedigits()
      .flatMap(combine)
      .filter(palindromic)
      .reduce(max)
  );
}

function ex5() {
  const factors: number[] = nats()
    .takeWhile(lessThan(21))
    .toArray();

  const [highest, ...rest] = factors.reverse();

  const isMultipleOfAll: (fs: number[]) => Predicate<number> = fs => x => !fs.find(f => x % f !== 0);

  const r = rest.reduce(prod);
  const product = ints()
    .filter(greaterThan(1))
    .takeWhile(lessThan(r))
    .map(x => x * highest)
    .filter(isMultipleOfAll(rest))
    .first();
  console.log("Ex5:", product);
}

function ex6() {
  const lim = 100;
  const sumSquares = nats()
    .takeWhile(lessThan(lim + 1))
    .map(square)
    .reduce(sum);

  const sumNums = nats()
    .takeWhile(lessThan(lim + 1))
    .reduce(sum);
  const squareSum = square(sumNums || 0);

  const diff = squareSum - (sumSquares || 0);

  console.log("Ex6:", diff);
}

function ex7() {
  console.log(
    "Ex7:",
    zip(nats(), primes())
      .takeWhile(([i]) => i <= 10001)
      .map(([, p]) => p)
      .last()
  );
}

function ex9() {
  const squares = () =>
    nats()
      .map(x => ({ x, x2: square(x) }))
      .takeWhile(({ x }) => lessThan(1000)(x));

  const squaresTo1000 = squares().toArray();

  function sqrt(n: number): number {
    const root = squaresTo1000.find(({ x2 }) => x2 === n);
    return root ? root.x : 0;
  }

  const [a, b, c] = squares()
    .flatMap(a => squares().map(b => [a, b]))
    .map(([a, b]) => [a, b, { x: sqrt(a.x2 + b.x2), x2: a.x2 + b.x2 }])
    .filter(([, , c]) => c.x > 0)
    .filter(([a, b, c]) => a.x + b.x + c.x === 1000)
    .first()

  console.log("Ex9:", a.x * b.x * c.x);
}

function ex20() {
  function fact(f: bigint): bigint {
    if (f === 0n) {
      return 1n;
    } else {
      return BigInt(f * fact(f - 1n));
    }
  }
  console.log(
    "Ex20: ",
    fact(100n)
      .toString()
      .split("")
      .map(c => +c)
      .reduce(sum)
  );
}

ex1();
ex2();

ex3();
ex4();
ex5();
ex6();
ex7();

ex9();
ex20();
/**
Ex1: 233168
Ex2: 4613732
Ex3: 6857
Ex4: 906609
Ex5: 232792560
Ex7: 104743
Ex9: 31875000
Ex20:  648
 */
