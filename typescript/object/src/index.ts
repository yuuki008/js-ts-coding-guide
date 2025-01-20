type FooBar = {
  foo: string;
  bar: number;
}

type FooBarBaz = {
  foo: string;
  bar: number;
  baz: boolean;
}

const obj: FooBarBaz = {
  foo: 'hello',
  bar: 42,
  baz: true,
};
const obj2: FooBar = obj

