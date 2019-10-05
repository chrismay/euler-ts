const sum = (a, b) => a + (b ? b : 0);
const prod = (a, b) => a * b;
const square = x => x * x;
const lessThan = lim => x => x < lim;
const greaterThan = lim => x => x > lim;

const toArray = (v, arr) => {
  if (arr) {
    return arr.concat([v]);
  } else {
    return [v];
  }
};
const max = (v, acc) => (v > (acc ? acc : 0) ? v : acc);

Array.prototype.last = function() {
  return this.slice(-1)[0];
};

const Generator = Object.getPrototypeOf(function*() {});

Generator.prototype.map = function*(f) {
  for (const v of this) {
    yield f(v);
  }
};
Generator.prototype.filter = function*(p) {
  for (const v of this) {
    if (p(v)) {
      yield v;
    }
  }
};
Generator.prototype.first = function() {
  for (const v of this) {
    return v;
  }
};

Generator.prototype.takeWhile = function*(predicate, context) {
  for (const v of this) {
    if (!predicate.call(context, v)) {
      return v;
    }
    yield v;
  }
};

Generator.prototype.fold = function(ff, init, context) {
  let acc = init;
  for (const v of this) {
    acc = ff.call(context, v, acc);
  }
  return acc;
};

Generator.prototype.reduce = function(ff) {
  let acc;
  for (const v of this) {
    acc = ff(v, acc);
  }
  return acc;
};

const last = v => v;

function* product(gen1f, gen2f) {
  for (const v of gen1f()) {
    for (const w of gen2f()) {
      yield function*() {
        yield v;
        yield w;
      };
    }
  }
}

function* zip(gen1, gen2) {
  for (const v of gen1) {
    const { value, done } = gen2.next();
    if (!done) {
      yield [v, value];
    } else {
      return [v, value];
    }
  }
}
Generator.prototype.flatten = function*(combiner, zero) {
  for (const gen of this) {
    yield gen().fold(combiner, zero);
  }
};

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
  const primes = [];
  function notprime(x) {
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
  const isDivisible = x => x % 3 === 0 || x % 5 === 0;

  console.log(
    "Ex1:",
    ints()
      .filter(isDivisible)
      .takeWhile(x => x < 1000)
      .reduce(sum)
  );
}

function ex2() {
  function fibsTo(limit) {
    function fib(limit, acc) {
      const [a, b] = acc.slice(-2);
      if (b >= limit) {
        return acc;
      }
      return fib(limit, [...acc, a + b]);
    }
    return fib(limit, [1, 2]);
  }

  const isEven = x => x % 2 === 0;

  console.log(
    "Ex2:",
    fibsTo(4000000)
      .filter(isEven)
      .reduce(sum)
  );
}

function ex3() {
  function nextprime(above, primes) {
    function notprime(x) {
      return primes.find(p => x % p === 0);
    }
    let next = above + 1;
    while (notprime(next)) {
      next = next + 1;
    }
    return next;
  }

  function factors(n) {
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
  function reverseString(str) {
    return str
      .split("")
      .reverse()
      .join("");
  }
  const threedigits = () =>
    ints()
      .filter(x => x > 99)
      .takeWhile(x => x < 1000);

  const palindromic = x => "" + x === reverseString("" + x);

  console.log(
    "Ex4:",
    product(threedigits, threedigits)
      .flatten((a, b) => a * b, 1)
      .filter(palindromic)
      .reduce(max)
  );
}

function ex5() {
  const factors = nats()
    .takeWhile(lessThan(21))
    .reduce(toArray);

  const [highest, ...rest] = factors.reverse();

  const isMultipleOfAll = fs => x => !fs.find(f => x % f !== 0);

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
      .reduce(last)
  );
}

function ex9() {
  const squares = () =>
    nats()
      .map(x => ({ x, x2: square(x) }))
      .takeWhile(({ x }) => lessThan(1000)(x));

  const squaresTo1000 = squares().reduce(toArray);

  console.log(squaresTo1000.length);

  function sqrt(n) {
    const root = squaresTo1000.find(({ x2 }) => x2 === n);
    return root ? root.x : undefined;
  }

  const [a,b,c] = product(squares, squares)
    .flatten(toArray)
    .map(([a, b]) => [a, b, { x: sqrt(a.x2 + b.x2), x2: a.x2 + b.x2 }])
    .filter(([a, b, c]) => a.x + b.x + c.x === 1000)
    .first()

  console.log(a.x * b.x * c.x);
}

function ex20() {
  function fact(f) {
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

//ex1();
// ex2();

// ex3();
// ex4();
// ex5();
// ex7();

ex9();
//ex20();
