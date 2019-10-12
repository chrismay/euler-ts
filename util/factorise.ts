import { fromArray } from ".";
import { ints } from "./generators";

interface BasisReduction { n: number; factors: number[] }
interface WheelReduction { n: number; k: number; factors: number[] }

const square = (n: number) => n * n;

// initial factorisation by the basis for the wheel
function basisFactorise(base: number, acc: BasisReduction): BasisReduction {
    const { n, factors } = acc;
    if (n % base !== 0) {
        return acc;
    }
    return basisFactorise(base, { n: n / base, factors: [...factors, base] });
}

// Turn the wheel and generate candidate factors that are not eliminated by the basis
function* candidates(): Generator<number, void, unknown> {
    let k = 7;
    const inc = [4, 2, 4, 2, 4, 6, 2, 6];
    for (const i of ints()) {
        yield k;
        k = k + inc[i % inc.length];
    }
}

// reduce the multiple by a single candidate factor
function wheelReduce(k: number, br: WheelReduction): WheelReduction {
    const { n, factors } = br;
    if (n % k === 0) {
        const bf = basisFactorise(k,{n, factors});
        return {k: br.k,  ...bf};
    } else {
        return { ...br };
    }
}

export function wheelFactorise(num: number): number[] {

    const basis = [2, 3, 5];
    const br = fromArray(basis).fold(basisFactorise, { n:num, factors: [] });

    const init: WheelReduction = { ...br, k: 7 };

    const { n, factors } = candidates().foldMap(wheelReduce, init).takeWhile(wr => square(wr.k) <= wr.n).lastOrDefault(init);

    if (n > 1) factors.push(n);
    return factors;
}
