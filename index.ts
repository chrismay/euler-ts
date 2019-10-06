const sum = (a: number, b: number) => a + (b ? b : 0);
const prod = (a: number, b: number) => a * b;
const square = (x: number) => x * x;
const lessThan = (lim: number) => (x: number) => x < lim;
const greaterThan = (lim: number) => (x: number) => x > lim;

function toArray<T>(v: T, arr: Array<T> = []): Array<T> {
  if (arr) {
    return arr.concat([v]);
  } else {
    return [v];
  }
};

const max: FoldFunction<number, number> = (v, acc) => (v > (acc ? acc : 0) ? v : acc);

interface Array<T> {
  last(): T;
}

Array.prototype.last = function () {
  return this.slice(-1)[0];
};

type FoldFunction<TFrom, TTo> = (v: TFrom, acc: TTo) => TTo;

interface Generator<T, TReturn, TNext> {
  map<To>(f: (t: T) => To): Generator<To, TReturn, TNext>;
  filter(p: (t: T) => boolean): Generator<T, TReturn, TNext>;
  first(): T;
  takeWhile(p: (t: T) => boolean): Generator<T, TReturn, TNext>;
  fold<To>(ff: FoldFunction<T, To>, init: To): To;
  reduce<To>(ff: FoldFunction<T, To>): To;
  last(): T;
  flatMap<To>(f: (v: T) => Generator<To, TReturn, TNext>): Generator<To, TReturn, TNext>;
  //  flatten<To>(ff:FoldFunction<T,To>, zero:To):Generator<To, TReturn,TNext>;
  toArray(): T[];
}
type Predicate<T> = (v: T) => boolean;

const Generator = Object.getPrototypeOf(function* () { });

Generator.prototype.map = function*<T, To>(f: (t: T) => To) {
  for (const v of this) {
    yield f(v);
  }
};
Generator.prototype.filter = function* <T>(p: Predicate<T>) {
  for (const v of this) {
    if (p(v)) {
      yield v;
    }
  }
};
Generator.prototype.first = function () {
  for (const v of this) {
    return v;
  }
};

Generator.prototype.takeWhile = function* <T>(p: Predicate<T>) {
  for (const v of this) {
    if (!p(v)) {
      return v;
    }
    yield v;
  }
};

Generator.prototype.fold = function <TFrom, TTo>(ff: FoldFunction<TFrom, TTo>, init: TTo): TTo {
  let acc = init;
  for (const v of this) {
    acc = ff(v, acc);
  }
  return acc;
};

Generator.prototype.reduce = function <TFrom, TTo>(ff: FoldFunction<TFrom, TTo>) {
  let acc;
  for (const v of this) {
    acc = ff(v, acc);
  }
  return acc;
};

Generator.prototype.toArray = function () {
  const arr = [];
  for (const v of this) {
    arr.push(v);
  }
  return arr;
}

Generator.prototype.last = function () {
  let last;
  for (const v of this) {
    last = v;
  }
  return last;
};

Generator.prototype.flatMap = function* <TFrom, TTo>(f: (v: TFrom) => Generator<TTo, void, unknown>) {
  for (const v of this) {
    for (const vv of (f(v))) {
      yield vv;
    }
  }
}

function* zip<T1, T2>(gen1: Generator<T1, void, unknown>, gen2: Generator<T2, T2, T2>): Generator<[T1, T2], (T1 | T2)[], unknown> {
  for (const v of gen1) {
    const { value, done } = gen2.next();
    if (!done) {
      yield [v, value];
    } else {
      return [v, value];
    }
  }
}

function* ints() {
  let i = 0;
  while (true) {
    yield i;
    i++;
  }
}

const nats = () => ints().filter(greaterThan(0));

function* primes() {
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

  const squareSum = square(
    nats()
      .takeWhile(lessThan(lim + 1))
      .reduce(sum)
  );

  const diff = squareSum - sumSquares;

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

  function sqrt(n: number) {
    const root = squaresTo1000.find(({ x2 }) => x2 === n);
    return root ? root.x : undefined;
  }

  const [a, b, c] = squares().flatMap(a => squares().map(b => [a, b]))
    .map(([a, b]) => [a, b, { x: sqrt(a.x2 + b.x2), x2: a.x2 + b.x2 }])
    .filter(([a, b, c]) => a.x + b.x + c.x === 1000)
    .first()

  console.log("Ex9:", a.x * b.x * c.x);
}

function ex20() {
  function fact(f:bigint):bigint {
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
ex7();

ex9();
ex20();
/**
 * [Running] ts-node "c:\Users\chris\code\euler\index.ts"
Ex1: 233168
Ex2: 4613732
Ex3: 6857
Ex4: 906609
Ex5: 232792560
Ex7: 104743
Ex9: 31875000
Ex20:  648
 */
