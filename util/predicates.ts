export type Predicate<T> = (v: T) => boolean;

export const lessThan: (lim: number) => Predicate<number> = lim => x => x < lim;
export const greaterThan: (lim: number) => Predicate<number> = lim => x => x > lim;
