import { properDivisiors } from "../util/factorise";
import { sum, ℕ, lessThan } from "../util";


function sumDivisors(n: number) {
    return properDivisiors(n).reduce(sum);
}

function isAmicable(n: number) {
    const pair = sumDivisors(n);
    return (sumDivisors(pair) === n) && (pair !== n);
}

export function ex21(){
    console.log("Ex 21:", ℕ().filter(isAmicable).takeWhile(lessThan(10000)).reduce(sum));
}
