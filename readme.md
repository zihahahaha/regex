# 简介

基于 regex 的词法解析器 js 实现

[参考1](https://deniskyashif.com/2020/08/17/parsing-regex-with-recursive-descent/)
[参考2](https://github.com/deniskyashif/regexjs/tree/master)

# regex 产生式

expr :: term `(` | term `)*`  
term :: `(` factor `)*`  
factor :: atom `(` \* `)?`   
atom :: char `|` (expr)  
char :: <非操作符>  
<操作符> :: | `|` \* `|` \(  

# 定义

- 1）空字符正规
- 2）a 属于 ASCII，a 正规
- 3）m，n 正规
  - 3.1 (m) 正规
  - 3.2 (m)(n) 正规
  - 3.3 (m)|(n) 正规
  - 3.4 (m)\*正规
- plus：规定结合优先级 \* > 连接 > |
