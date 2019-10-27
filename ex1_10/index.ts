import { lessThan, max, Predicate, primes, prod, sum, zip, ℕ } from "../util";

const square: (x: number) => number = x => x * x;

function ex1() {
  const isDivisible = (x: number) => x % 3 === 0 || x % 5 === 0;

  console.log(
    "Ex1:",
    ℕ()
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
    ℕ()
      .exclude(lessThan(100))
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
  const factors: number[] = ℕ()
    .takeWhile(lessThan(21))
    .toArray();

  const [highest, ...rest] = factors.reverse();

  const isMultipleOfAll: (fs: number[]) => Predicate<number> = fs => x => !fs.find(f => x % f !== 0);

  const r = rest.reduce(prod);
  const product = ℕ()
    .takeWhile(lessThan(r))
    .map(x => x * highest)
    .filter(isMultipleOfAll(rest))
    .first();
  console.log("Ex5:", product);
}

function ex6() {
  const lim = 100;
  const sumSquares = ℕ()
    .takeWhile(lessThan(lim + 1))
    .map(square)
    .reduce(sum);

  const sumNums = ℕ()
    .takeWhile(lessThan(lim + 1))
    .reduce(sum);
  const squareSum = square(sumNums || 0);

  const diff = squareSum - (sumSquares || 0);

  console.log("Ex6:", diff);
}

function ex7() {
  console.log(
    "Ex7:",
    zip(ℕ(), primes())
      .takeWhile(([i]) => i <= 10001)
      .map(([, p]) => p)
      .last()
  );
}

function ex8() {
  const data = `7316717653133062491922511967442657474235534919493496983520312774506326239578318016984801869478851843858615607891129494954595017379583319528532088055111254069874715852386305071569329096329522744304355766896648950445244523161731856403098711121722383113622298934233803081353362766142828064444866452387493035890729629049156044077239071381051585930796086670172427121883998797908792274921901699720888093776657273330010533678812202354218097512545405947522435258490771167055601360483958644670632441572215539753697817977846174064955149290862569321978468622482839722413756570560574902614079729686524145351004748216637048440319989000889524345065854122758866688116427171479924442928230863465674813919123162824586178664583591245665294765456828489128831426076900422421902267105562632111110937054421750694165896040807198403850962455444362981230987879927244284909188845801561660979191338754992005240636899125607176060588611646710940507754100225698315520005593572972571636269561882670428252483600823257530420752963450`;

  const windowSize = 13;

  function* windows() {
    let cursor = 0;
    while (cursor + windowSize < data.length) {
      yield data.slice(cursor, cursor + windowSize);
      cursor++;
    }
  }
  console.log("Ex8:", windows()
    .map(word => word.split("").map(c => +c).reduce(prod))
    .reduce(max));

}

function ex9() {
  const squares = () =>
    ℕ()
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
    .first();

  console.log("Ex9:", a.x * b.x * c.x);
}

function ex10() {
  console.log("Ex10:", primes().takeWhile(lessThan(2000000)).reduce(sum));
}
export function ex1To10() {
  ex1();
  ex2();

  ex3();
  ex4();
  ex5();
  ex6();
  ex7();
  ex8();
  ex9();
  console.log('Ex10 takes 60 seconds, so skipping...');
  if (false) ex10();
}
