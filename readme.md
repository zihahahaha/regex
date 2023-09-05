# 简介

基于 regex 的词法解析器 js 实现

# regex 产生式

exp :: plus `(` | plus `)*`
plus :: `(` factor `(` \* `)*` `)*`
factor:: word `|` (exp)

## 另一种产生式

网上找的，我用 regex 表示法翻译一下
[参考](https://deniskyashif.com/2020/08/17/parsing-regex-with-recursive-descent/)
expr :: term `(` | term `)*`
term :: `(` factor `)*`
factor :: `(` atom `)` `(` ? `|` \* `|` + `)*`
atom :: word `|` (expr)

跟我人肉的差不多嘛，term 到 factor 由于是一元操作符，确实可以省略一层递归，不过写成这样操作符优先级比较清楚

# 定义

- 1）空字符正规
- 2）a 属于 ASCII，a 正规
- 3）m，n 正规
  - 3.1 (m) 正规
  - 3.2 (m)(n) 正规
  - 3.3 (m)|(n) 正规
  - 3.4 (m)\*正规
- plus：规定结合优先级 \* > 连接 > |
