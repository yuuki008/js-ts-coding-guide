## 部分型関係 (Subtyping Relation)
> **部分型**とは、2 つの関係の互換性を表す概念です。型Sが型Bの部分型であると、S型の値がB型の値でもあることを指します。

```typescript
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
    foo: 'Hello',
    bar: 42,
    baz: true
}
const obj2: FooBar = obj; // OK
```

上記の型の `FooBarBaz` は `FooBar` の部分型になっている。そのため `FooBarBaz` 型で定義された変数を `FooBar` 型に代入できる。
**typescript では、宣言されたプロパティ以外の追加のプロパティを持っていてもコンパイルエラーにならない。**
そのため上記のように `FooBar` にはない `baz` プロパティを持っていても `FooBar` 型の値としてみなされる。

> **余剰プロパティチェックはオブジェクトリテラルだけを検査する**
余剰プロパティチェックはオブジェクトの余計なプロパティを禁止するため、コードが型に厳密になるよう手助けをします。しかし、余剰プロパティチェックが効くのは、オブジェクトリテラルの代入に対してのみです。なので、変数代入にはこのチェックは働きません。
```typescript
type FooBar = {
    foo: string;
    bar: number;
}
const obj3: FooBar = {
    foo: 'Hello',
    bar: 42,
    baz: true // Error
}
```
引用: [余剰プロパティチェック (excess property checking)](https://typescriptbook.jp/reference/values-types-variables/object/excess-property-checking)

このオブジェクトリテラルのみへのチェックは、型安全性とは関係はなく、プログラマのミスを防止するためのもの。
上記のように `FooBar` 型のオブジェクトへ `baz` プロパティを宣言したとしても、アクセス時にコンパイルエラーになるの無意味なプロパティになる。そのため typescript は、オブジェクトリテラルにのみ余剰プロパティチェックを行なっている。


> [!NOTE]
**構造的部分型と名前的部分型**
上記の FooBarBaz と FooBar のように部分型を明示的に宣言しなくとも型の構造が一致していれば部分型として扱うことを構造的部分型と呼ぶ。一方で明示的に部分型を宣言することを名前的部分型と呼ぶ。
構造的部分型は、比較的珍しい。

オブジェクト内のプロパティにおいても部分型の概念は適用される。

```typescript
type Animal = {
    age: number;
}

type Human = {
    age: number;
    name: string;
}

type AnimalFamily = {
    familyName: string;
    father: Animal;
    mother: Animal;
    child: Animal;
}

type HumanFamily = {
    familyName: string;
    father: Human;
    mother: Human;
    child: Human;
}
```

`HumanFamily` は `AnimalFamily` の部分型になっている。
プリミティブな値である `familyName` は当然部分型になるが、`father`, `mother`, `child` は `Human` が `Animal` の部分型であるため、`HumanFamily` は `AnimalFamily` の部分型になる。


# 型引数

Typescript では型を定義する時にパラメーターを持たせることができる。

```typescript
type Employee<T> = {
    name: string;
    department: T;
}
```

上記のように `T` という型引数を受け取り、型の中で使用することができる。
型引数を持つ型は型引数を受け取って、初めて型を完成されるため、使用時に型引数を指定しなかった場合はコンパイルエラーが発生する。

```typescript
const department = {
    id: 1,
    name: 'Marketing'
}

const employee: Employee = {
    name: 'John',
    department // Error: Generic type 'Employee' requires 1 type argument(s).
}
```

また型引数は複数の指定も可能。

```typescript
type Employee<T, U> = {
    name: string;
    department: T;
    position: U;
}
```

## 型引数への制約

`extends` で型引数に制約を加えることができる。

```typescript
type Department = {
    id: number;
    name: string;
}
type Employee<T extends Department> = {
    name: string;
    department: T;
}

type Position = 'Manager' | 'Staff';
const employee: Employee<Position> = {
    name: 'John',
    department: 'Manager' // Error: Type 'string' is not assignable to type 'Position'.
}
```

`extends` で指定した型の部分型のみを受け付けるようになる。


## オプショナルな型引数

型引数にデフォルト値を指定することができる。

```typescript
type Employee<T = Department> = {
    name: string;
    department: T;
}

const employee: Employee = {
    name: 'John',
    department: {
        id: 1,
        name: 'Marketing'
    }
}
```
上記のように型引数を指定しなかった場合はデフォルト値が適用される。

