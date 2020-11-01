export const getValue = (wrapper, defaultValue = []) =>
  wrapper.type === "nothing" ? defaultValue : wrapper.valueOf();

const Wrapper = (value) => ({
  map: (fn) => Wrapper(fn(value)),
  flatMap: (fn) => fn(value),
  valueOf: () => value,
  toString: () => `Wrapper (${value})`,
  type: "wrapper",
});

const Nothing = () => ({
  // eslint-disable-next-line no-unused-vars
  map: (fn) => Nothing(),
  flatMap: (fn) => fn(),
  valueOf: () => Nothing(),
  toString: () => `Nothing`,
  type: "nothing",
});

const MaybeOf = (value) =>
  value === null || value === undefined || value.type === "nothing"
    ? Nothing()
    : Wrapper(value);

export const Maybe = {
  of: MaybeOf,
};
