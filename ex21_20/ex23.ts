import { ℕ, sum, lessThan } from "../util";
import { properDivisors } from "../util/factorise";
import { Σ } from "../util/reducers";

function isAbundant(n: number): boolean {
    return properDivisors(n).reduce(sum) > n;
}

// create an array so that we can iterate it in order, smallest first...
const abundantsArr = ℕ().takeWhile(lessThan(28124)).filter(isAbundant).toArray();
// and a set so that we can quickly identify whether a number exists in the set
const abundantsSet = new Set(abundantsArr);

function isSumOfAbundants(n: number): boolean {

    return !!(abundantsArr.filter(lessThan(n - 11)).find(a => abundantsSet.has(n - a)));
}

export function ex23() {
    console.log("Ex 23:",
        Σ(ℕ().takeWhile(lessThan(28124)).exclude(isSumOfAbundants)));
}
