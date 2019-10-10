export type Reducer<TFrom, TTo> = (v: TFrom, acc?: TTo) => TTo;
export type Fold<TFrom, TTo> = (v: TFrom, acc: TTo) => TTo;

export const sum: Reducer<number, number> = (a, b) => a + (b ? b : 0);
export const prod: Reducer<number, number> = (a: number, b?: number) => a * (b !== undefined ? b : 1);
export const max: Reducer<number, number> = (next: number, prev?: number) => {
  if (prev !== undefined) {
    return next > prev ? next : prev;
  } else {
    return next;
  }
};

type Count = { [n: number]: number }
export const frequency: Reducer<number, Count> = (n, freqs = {}) => {
  const prev = freqs[n] || 0;
  freqs[n] =  prev + 1;
  return freqs;
};
