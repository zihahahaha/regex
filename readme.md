# 简介

基于 regex 的词法解析器js实现

# regx 产生式

exp :: plus `|` plus | exp
plus :: `{` factor `[` \* `]` `}` ...
factor:: word `|` (exp)
