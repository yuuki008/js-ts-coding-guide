# スプレッド構文

配列やオブジェクトを展開して、別の配列やオブジェクトに展開することができる構文です。

```js
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [...arr1, ...arr2];
console.log(arr3); // [1, 2, 3, 4, 5, 6]

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const obj3 = { ...obj1, ...obj2 };
console.log(obj3); // { a: 1, b: 2, c: 3, d: 4 }
```

同じプロパティが存在する場合は、後に指定したプロパティが優先される。

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, a: 3 };
console.log(obj2); // { a: 3, b: 2 }
```

スプレッド構文のオブジェクトに通常のプロパティ宣言のプロパティが含まれている場合は、コンパイルエラーが発生する。

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 3, ...obj1 };
// typescript: 'a' is specified more than once, so this usage will be overwritten,
```

# オブジェクトの型
## インデックスシグネチャ

オブジェクトのプロパティに対して、任意のプロパティを追加できる機能です。

```typescript

type PriceData = {
  [key: string]: number;
};

const priceData: PriceData = {
  apple: 100,
  banana: 200,
};
data.orange = 300;
data.city = 'Fukuoka';
// Error: type 'Fukuoka' is not assignable to type 'number'.
```

### 注意点
インデックスシグネチャは、オブジェクトのプロパティに対して任意のプロパティを追加できる機能ですが、型安全性が低下するため、使用は避けるべき。以下のようなプログラムをコンパイル時にエラーとして検出できない。

```typescript
type MyObj = { [key: string]: number };
const obj: MyObj = { a: 1, b: 2 };
const num: number = obj.c
console.log(num); // undefined
```

`MyObj` で宣言された型は、どんなプロパティでアクセスしても `number` 型を返すという意味であり、存在しないプロパティにアクセスした時に実際には `undefined` にも関わらず、`number` 型として typescript が認識してしまう。
インデックスシグネチャを使用したオブジェクトは、実際にプロパティが存在するかどうかとは無関係にどんなプロパティにもアクセスできるという特性を持つ。この特性により型安全性が破壊されてしまう。

**インデックスシグネチャを使用する場合は、型安全性が低下するため、使用は避ける**

## オプショナルなプロパティ

オプショナルなプロパティの宣言方法は、プロパティ名の後ろに `?` を付ける。

```typescript
type User = {
  name: string;
  age?: number;
};

const user1: User = { name: 'Taro' };
const user2: User = { name: 'Jiro', age: 20 };
```

オプショナルなプロパティにアクセスした時の型は、`number` または `undefined` (ユニオン型) となる。

```typescript
const user: User = { name: 'Taro' };
const age: number | undefined = user.age;
```

`number | undefined` ユニオン型の値は、通常の `number` のように使用できない。

```typescript
const user: User = { name: 'Taro' };
const age: number = user.age;
// Error: Type 'number | undefined' is not assignable to type 'number'.
```

## 読み取り専用のプロパティの宣言

プロパティ名の前に `readonly` を付けることで、読み取り専用のプロパティを宣言できる。

```typescript
type User = {
  readonly name: string;
  age: number;
};

const user: User = { name: 'Taro', age: 20 };
user.name = 'Jiro'; // Error: Cannot assign to 'name' because it is a read-only property.
```

> [!IMPORTANT]
Javascript だとオブジェクトのプロパティを変更できてしまうが、Typescript では `readonly` を使用することで、プロパティの変更を防ぐことができる。

## typeof キーワードで変更の型を得る

`typeof` キーワードを使用することで、変数の型を取得することができる。
**型推論の結果を型として抽出・再利用したい場合に typeof は効果的**

```typescript
const obj = { a: 1, b: 2 };
type ObjType = typeof obj;
const obj2: ObjType = { a: 3, b: 4 };
```

### いつ使うべきか
基本的には、型を明示的に宣言する方がわかりやすいプログラムになるため、`typeof` はあまり使うべきではない。

> 見極めるためのポイントは、「何が最上位の事実か」を考えることです。基本的に、プログラムを支える前提となる事実はプログラム上に明記されるべきです。そこから自動的に導かれるような付属的な事柄については、（わかりやすさのために明記してもかまいませんが）明記しなくても良いことがあります。

最上位が事実が型のパターンは、以下のように `type` で明示的に宣言する。
`telNumber` のプロパティが追加になった場合に変更するべきは `User` 型で、その後に付属して残りのプログラムを変更することが望ましい。

```typescript
type User = { name: string; age: number }
```

最上位が値のパターンは、次のようなものが挙げられる。

```typescript
const commands = ["attack", "defend", "run"] as const;
type Command = typeof commands[number];
```

上記のプログラムを型が最上位になるように変更すると、以下のようになり、Command に何があるかという事実が 2 か所に分散してしまう。

```typescript
type Command = "attack" | "defend" | "run";
const commands: Command[] = ["attack", "defend", "run"];
```
# 部分型関係

## 部分型とは
2 つの型の互換性を表す概念で、ある型が別の型の一部である場合、部分型関係にあると言います。

```typescript
```
