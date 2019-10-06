import { greaterThan, lessThan, nats, Predicate, zip, primes, sum, max, prod } from "../util";

const square: (x: number) => number = x => x * x;

function ex1() {
  const isDivisible = (x: number) => x % 3 === 0 || x % 5 === 0;

  console.log(
    "Ex1:",
    nats()
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
    nats()
      .filter(greaterThan(99))
      .takeWhile(lessThan(1000));

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
  const product = nats()
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

export function ex1To10(){
    ex1();
    ex2();

    ex3();
    ex4();
    ex5();
    ex6();
    ex7();

    ex9();
}
