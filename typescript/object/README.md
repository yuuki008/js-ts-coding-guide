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

# 配列

> [!IMPORTANT]
**Typescript で配列はオブジェクトの一種**
そのためオブジェクトと同様に `const` で宣言した配列の要素も変更が可能。
```typescript
const arr = [1, 2, 3];
arr.push(4);
console.log(arr); // [1, 2, 3, 4]
arr[0] = 0;
console.log(arr); // [0, 2, 3, 4]
```
型の宣言方法には以下のように2つがある。
```typescript
const arr: number[] = [1, 2, 3];
const arr: Array<number> = [1, 2, 3];
```

## readonly

Javascript では配列の中身の変更をすることができますが、Typescript の `readonly` を使用することで配列の中身の変更を禁止することができます。

```typescript
const arr: readonly number[] = [1, 2, 3];
aa[1] = 400 // Error: Index signature in type 'readonly number[]' only permits reading.
```
> [!IMPORTANT]
> **オブジェクトには積極的に `readonly` を使用しよう**
> Javascript のオブジェクトは参照型のデータであるため、予期せぬ変更を防ぐことができない。そのため typescript の `readonly` は配列の中身の変更を禁止するようにしよう。

## タプル型

**要素数が固定された配列型のことをタプル型と呼ぶ。**
要素数が固定されている代わりに、それぞれの要素に異なる型を指定できる。
要素を超えた数のアクセスや、型の不一致による代入はエラーになる。


```typescript
const tuple: [string, number] = ['Hello', 42];

tuple[0] = 'World'; // OK
tuple[1] = 100; // OK
tuple[2] = 200; // Error: Tuple type '[string, number]' of length '2' has no element at index '2'.
tuple[1] = 'World'; // Error: Type 'string' is not assignable to type 'number'.
```

> [!NOTE]
> **タプル型のユースケースがわからない**
> 基本的に固定長の配列型は、オブジェクト型で代用できるし、そっちの方が可読性が高い。
> ラベル付きのタプルも定義できるが、呼び出す時に user.name は使えない
```typescript
type User = [name: string, age: number]
const user: User = ['John', 42];
console.log(user.name); // Error: Property 'name' does not exist on type 'User'.
```

> [!TIP]
**インデックスアクセスは極力避ける**
配列型もインデックスシグネチャと同様に Typescript と実行時のランタイムで矛盾が起こる可能性がある。
配列型では要素数が決まっていないため、指定するインデックスに制限がない。よって存在しないインデックスにアクセスしても Typescript はエラーを出さない。
以下のように `arr[100]` の要素は `Typescript` では `number` として扱われるが、実行時には `undefined` が入り、矛盾が生じる。
```typescript
const arr: number[] = [1, 2, 3];
console.log(arr[100]); // undefined
```

# 分割代入

