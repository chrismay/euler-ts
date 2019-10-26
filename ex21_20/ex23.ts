import { ℕ, not, sum, lessThan } from "../util";
import { properDivisiors } from "../util/factorise";

function isAbundant(n: number): boolean {
    return properDivisiors(n).reduce(sum) > n;
}

const abundantsArr = ℕ().takeWhile(lessThan(28124)).filter(isAbundant).toArray();
const abundantsSet = new Set(abundantsArr);

function isSumOfAbundants(n: number): boolean {

    return !!(abundantsArr.filter(lessThan(n - 11)).find(a => abundantsSet.has(n - a)));
}

console.log("Ex 23:", ℕ()
    .takeWhile(lessThan(28124))
    .filter(not(isSumOfAbundants))
    .reduce(sum));
