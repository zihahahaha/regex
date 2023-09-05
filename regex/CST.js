class TreeNode {
  label;
  children;
  constructor(label, children) {
    this.label = label;
    this.children = children || [];
  }
}

//句法分析器(递归下降法)
function syntaxAnalyzer(regex) {
  let index = 0;

  const notEnd = () => index < regex.length;
  const peek = () => regex[index];

  function notOperator() {
    if (regex[index] !== "|" && regex[index] !== "*" && regex[index] !== ")") {
      return regex[index++];
    } else return false;
  }

  function match(character) {
    if (regex[index] === character) {
      index++;
      return true;
    } else return false;
  }

  function expr(flag = false) {
    const termNode = term();
    if (notEnd() && match("|"))
      return new TreeNode("expr", [termNode, new TreeNode("|"), expr()]);
    else if (notEnd() && peek() === ")" && !flag) throw "右括号不匹配";
    else return new TreeNode("expr",[termNode]);
  }
  function term() {
    const factorNode = factor();
    if (notEnd() && peek() !== ")" && peek() !== "|") {
      return new TreeNode("term", [factorNode, term()]);
    } else return new TreeNode("term", [factorNode]);
  }
  function factor() {
    const atomNode = atom();
    if (notEnd() && match("*")) {
      return new TreeNode("factor", [atomNode, new TreeNode("*")]);
    } else return new TreeNode("factor", [atomNode]);
  }
  function atom() {
    if (match("(")) {
      const exprNode = expr(true);
      if (match(")")) {
        return new TreeNode("atom", [
          new TreeNode("("),
          exprNode,
          new TreeNode(")"),
        ]);
      } else throw "左括号没闭合";
    }
    if ((word = notOperator())) {
      return new TreeNode("atom", [new TreeNode(word)]);
    } else throw "操作符不应出现";
  }

  return expr();
}

module.exports = {
  syntaxAnalyzer,
};
