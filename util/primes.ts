export function* primes(): Generator<number, void, void> {
    let prev = 1;
    const primes: number[] = [];
    function notprime(x: number) {
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
