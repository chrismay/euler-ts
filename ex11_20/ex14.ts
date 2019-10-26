import { greaterThan, lessThan, ℕ } from "../util";
import { maxBy } from "../util/reducers";

type Cache = { [key: number]: number };
type Accumulator = { i: number; n: number; cache: Cache };

function collatzMapping(i: number, acc: Accumulator): Accumulator {
    if (acc.cache[acc.n] !== undefined) {
        return { i: i + acc.cache[acc.n] - 1, n: 2, cache: acc.cache };
    }
    if (acc.n % 2 == 0) {
        return { i, n: acc.n / 2, cache: acc.cache };
    } else {
        return { i, n: (3 * acc.n) + 1, cache: acc.cache };
    }
}

function collatz(start: number, cache: Cache): Accumulator {
    const res = ℕ()
        .foldMap(collatzMapping, { i: 0, n: start, cache })
        .takeWhile(({ n }) => greaterThan(1)(n))
        .map(({ i, cache }) => ({ i: i + 2, n: start, cache }))
        .last();
    cache[start] = res.i - 2; // mutate rather than destructing, for efficiency
    return res;
};

// console.log(collatz(3, {}));
// console.log(collatz(5, {}));
// console.log(collatz(13, { 5: 4 }));
export function ex14(){
    console.log("Ex 14:",
        ℕ().
            filter(greaterThan(2))
            .takeWhile(lessThan(1000001))
            .foldMap((n, acc) => (collatz(n, acc.cache)), { i: 0, n: 0, cache: {} })
            //        .tap(acc => { if (acc.n % 10000 === 0) console.log(acc.n, acc.i); })
            .map(({ i, n }) => ({ n, i }))
            .reduce(maxBy(({ i }) => i)));

}
