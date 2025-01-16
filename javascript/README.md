# オブジェクト

キーと値を持つデータ構造のこと。
オブジェクトが格納された変数（**オブジェクト変数**）には、実際のデータそのものが格納されているわけではなく、データへの参照が格納されている。
そのため `const` で宣言されていてもオブジェクトの中身を書き換えることが可能。

```js
const obj = { key: 'value' };
obj.key = 'another value'; // OK
console.log(obj); // { key: 'another value' }
```

意図しない書き換えを防ぐために以下のような方法がある。

- `Object.freeze()`
- オブジェクトのコピー

## Object.freeze()

`Object.freeze()` を使うとオブジェクトの変更を禁止できる。

```js
const obj = Object.freeze({ key: 'value' });
obj.key = 'another value';
console.log(obj); // { key: 'value' }
```

> [!IMPORTANT]
**`Object.freeze()` は浅い凍結しか行わない**
```js
const nestedObj = Object.freeze({ key: { nestedKey: 'value' } });
nestedObj.key.nestedKey = 'another value';
console.log(nestedObj); // { key: { nestedKey: 'another value' } }
```
オブジェクトの全てのプロパティの変更を禁止するためには、再帰的に `Object.freeze()` を適用する必要がある。

## オブジェクトのコピー

オブジェクトのコピーを作成することで、元のオブジェクトを変更してもコピーには影響がない。

```js
const obj = { key: 'value' };
const copy = { ...obj };
obj.key = 'another value';
console.log(copy); // { key: 'value' }
```

> [!IMPORTANT]
**`{ ...obj }` は浅いコピーしか行わない**
```js
const nestedObj = { key: { nestedKey: 'value' } };
const copy = { ...nestedObj };
nestedObj.key.nestedKey = 'another value';
console.log(copy); // { key: { nestedKey: 'another value' } }
```
オブジェクトの全てのプロパティのコピーを作成するためには、再帰的にコピーを作成する必要がある。

