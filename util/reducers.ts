export type Reducer<TFrom, TTo> = (v: TFrom, acc?: TTo) => TTo;

export const sum: Reducer<number, number> = (a, b) => a + (b ? b : 0);
export const prod: Reducer<number, number> = (a: number, b?: number) => a * (b ? b : 1);
export const max: Reducer<number, number> = (test: number, current?: number) => {
  if (current) {
    return test > current ? test : current;
  } else {
    return test;
  }
}

