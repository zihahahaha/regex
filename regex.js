// 试着实现一下基于正则表达式作为模式表述的词法分析生成器（即实现正则表达式），添加了一些功能

// regex分词器
function regexTokens(regex) {
  const tokens = [];
  let string = "";
  for (let index = 0; index < regex.length; index++) {
    const c = regex[index];
    if (c === "(" || c === ")" || c === "|" || c === "*") {
      if (string.length > 0) {
        tokens.push({
          content: string,
          type: "word",
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
      type: "word",
    });
  return tokens;
}

//句法分析器(递归下降法)
function syntaxAnalyzer(tokens) {
  let index = 0;
  function exp() {
    plus();
    if (tokens[index]?.content === "|") {
      index++;
      exp();
    }
  }
  function plus() {
    while (factor()) {
      if (tokens[index]?.content === "*") index++;
    }
  }
  function factor() {
    if (tokens[index]?.type === "word") {
      index++;
      return true;
    } else if (tokens[index]?.content === "(") {
      const nowIndex = ++index;
      exp();
      if (tokens[index]?.content === ")") {
        if (nowIndex === index) console.log("WARNING:存在空白");
        index++;
        return true;
      } else return false;
    } else return false;
  }
  exp();
  if (tokens.length > index) throw "PARSE ERROR";
  console.log("ok");
}

module.exports = {
  regexTokens,
  syntaxAnalyzer,
};
