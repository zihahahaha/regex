// 把regex解析为语法树

export const TYPE = {
  EXPR: "expr",
  TERM: "term",
  FACTOR: "factor",
  ATOM: "atom",
};

class Node {
  type;
  constructor(type) {
    this.type = type;
  }
}

class Parent extends Node {
  children;
  constructor({ type, children }) {
    super(type);
    this.children = children || [];
  }
}

class Literal extends Node {
  value;
  constructor(value) {
    super("text");
    this.value = value;
  }
}

//句法分析器(递归下降法)
export function regex2st(regex) {
  let index = 0;

  const peek = () => (index < regex.length ? regex[index] : "");
  const next = () => index++;

  function expr() {
    const exprNode = {
      type: TYPE.EXPR,
      children: [term()],
    };
    while (peek() === "|") {
      next();
      exprNode.children.push(term());
    }
    return exprNode;
  }

  function term() {
    const termNode = new Parent({
      type: TYPE.TERM,
      children: [factor()],
    });
    while (peek() && peek() !== "|" && peek() !== ")") {
      termNode.children.push(factor());
    }
    return termNode;
  }

  function factor() {
    const atomNode = atom();
    const v = peek();
    if (v === "*" || v === "+" || v === "?") {
      next();
      return new Parent({
        type: TYPE.FACTOR,
        children: [atomNode, new Literal(v)],
      });
    } else
      return new Parent({
        type: TYPE.FACTOR,
        children: [atomNode],
      });
  }

  function atom() {
    if (peek() === "(") {
      next();
      const exprNode = expr();
      if (peek() === ")") {
        next();
        return new Parent({
          type: TYPE.ATOM,
          children: [new Literal("("), exprNode, new Literal(")")],
        });
      } else throw `atom:${index}:(expr)右括号缺失`;
    } else {
      return new Parent({
        type: TYPE.ATOM,
        children: [char()],
      });
    }
  }

  function char() {
    const v = peek();
    if (
      v === "|" ||
      v === "(" ||
      v === ")" ||
      v === "+" ||
      v === "*" ||
      v === "?"
    )
      throw `char:${index}:非法字符`;
    else {
      next();
      return new Literal(v);
    }
  }

  const exprNode = expr();
  if (peek() !== "") throw `regex:${index}:未解析字符`;
  return exprNode;
}
