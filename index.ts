import { ex1To10 } from "./ex1_10";
import { sum } from "./util";

ex1To10();

function ex20() {
  function fact(f: bigint): bigint {
    if (f === BigInt(0)) {
      return BigInt(1)
    } else {
      return BigInt(f * fact(f - BigInt(1)));
    }
  }
  console.log(
    "Ex20: ",
    fact(BigInt(100))
      .toString()
      .split("")
      .map(c => +c)
      .reduce(sum)
  );
}

ex20();

/*
Ex20:  648
 */
