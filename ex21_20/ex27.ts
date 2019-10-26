import { primes, range, ℤ } from "../util";
import { maxBy } from "../util/reducers";

function 𝕢(a: number, b: number) {
    return (n: number) => (n * n) + (a * n) + b;
}

// by trial and error, 300 primes are enough for the range we
// are testing over. Highest required prime is 1681; 300th prime is 1993
const ℙ = new Set(primes().take(300));
const prime = (n: number) => ℙ.has(n);


function countConsecutivePrimes(𝕗: (n: number) => number): number {
    return ℤ()
        .map(𝕗)
        .takeWhile(prime)
        .size();
}

function findMaxPrimes() {
    return range(-1000, 1000)
        .flatMap(a => range(-1000, 1000)
            .map(b => ({ a, b, c: countConsecutivePrimes(𝕢(a, b)) })));
}

export function ex27(){
    const max = findMaxPrimes().reduce(maxBy(({ c }) => c));
    max && console.log("Ex27: ", max, (max.a * max.b));
}

