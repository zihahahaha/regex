// 试着实现一下基于正则表达式作为模式表述的词法分析生成器（即实现正则表达式），添加了一些功能

// regex分词器
function regexTokens(regex) {
  const tokens = [];
  let string = "";
  for (let index = 0; index < regex.length; index++) {
    const c = regex[index];
    if (c === "(" || c === ")" || c === "|") {
      if (string.length > 0) {
        tokens.push({
          content: string,
          type: "WORD",
        });
        string = "";
      }
      tokens.push({
        content: c,
      });
    } else if (c === "*") {
      if (string.length > 1) {
        tokens.push({
          content: string.substring(0, string.length - 1),
          type: "WORD",
        });
        tokens.push({
          content: string.substring(string.length - 1),
          type: "WORD",
        });
        string = "";
      }
      if (string.length > 0) {
        tokens.push({
          content: string,
          type: "WORD",
        });
        string = "";
      }
      tokens.push({
        content: c,
      });
    } else {
      string += c;
    }
  }
  if (string.length > 0)
    tokens.push({
      content: string,
      type: "WORD",
    });
  return tokens;
}

//句法分析器(递归下降法)
function syntaxAnalyzer(tokens) {
  let index = 0;

  function exp(par) {
    par.push(plus());
    par.operator = "OR";
    // if (tokens[index]?.content === "|") {
    //   index++;
    //   exp(ast);
    // }
    // 尾递归改为迭代
    while (tokens[index]?.content === "|") {
      index++;
      par.push(plus());
    }
  }
  function plus() {
    const plusNode = [];
    plusNode.operator = "CONNECTION";
    while ((factorNode = factor())) {
      if (tokens[index]?.content === "*") {
        index++;
        let arr = [];
        arr.operator = "*";
        arr.push(factorNode);
        plusNode.push(arr);
      } else plusNode.push(factorNode);
    }
    return plusNode;
  }
  function factor() {
    if (tokens[index]?.type === "WORD") {
      return tokens[index++].content;
    } else if (tokens[index]?.content === "(") {
      const factorNode = [];
      const nowIndex = ++index;
      exp(factorNode);
      if (tokens[index]?.content === ")") {
        if (nowIndex === index) throw "PARSE ERROR:存在空白";
        index++;
        return factorNode;
      } else return false;
    } else return false;
  }
  const CST = [];
  exp(CST);
  if (tokens.length > index) throw "PARSE ERROR";
  else {
    console.log("ok");
    // console.dir(CST, { depth: null });
    const AST = (function toAST() {
      function simplify(node) {
        if (!node.operator) return;
        for (let i = 0; i < node.length; ++i) {
          const simplifyNode = simplify(node[i]);
          if (simplifyNode) node[i] = simplifyNode;
        }
        // 合并相邻文本节点
        if (node.operator === "CONNECTION" && node.length > 1) {
          let index = 0;
          for (let i = 0; i < node.length; ++i) {
            let string = "";
            while (!node[i]?.operator && i < node.length) {
              string += node[i++];
            }
            if (string.length > 0) node[index++] = string;
            if (i < node.length) node[index++] = node[i];
          }
          node.length = index;
        }
        if (node.length === 1 && node.operator !== "*") return node[0];
        else if (node.operator === "*") return node;
        else return;
      }
      simplify(CST);
      if (CST.length === 1 && CST?.operator !== "*") return CST[0];
      else return CST;
    })();

    
    console.dir(AST, { depth: null });
  }
}

module.exports = {
  regexTokens,
  syntaxAnalyzer,
};
