import { lessThan, ℕ } from "../util";
import { properDivisors } from "../util/factorise";
import { Σ } from "../util/reducers";
import { pipe } from "pipe-ts";

const sumDivisors = pipe(properDivisors, Σ);

function isAmicable(n: number) {
    const pair = sumDivisors(n);
    return (sumDivisors(pair) === n) && (pair !== n);
}

export function ex21() {
    console.log("Ex 21:", Σ(ℕ()
        .filter(isAmicable)
        .takeWhile(lessThan(10000))));
}
