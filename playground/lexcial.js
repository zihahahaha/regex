// 基本是龙书的实现，感觉除了麻烦，没什么好处(代码又长又难读，或许是方便自动生成？)

function lexcial(str) {
  let state = 0;
  let i = 0;
  function nextChar() {
    if (i >= str.length) return "EOF";
    else return str[i++];
  }
  function back() {
    i--;
  }
  function fail() {
    switch (state) {
      case 0:
        back();
    }
  }
  function nextToken() {
    state = 0;
    while (true) {
      switch (state) {
        case 0:
          c = nextChar();
          if (c === "+") state = 1;
          else if (c === "-") state = 2;
          else if (c === "*") state = 3;
          else if (c === "/") state = 4;
          else if (c === "=") state = 5;
          else if (c === "<") state = 6;
          else if (c === ">") state = 9;
          else if (c === "EOF") state = "EOF";
          else state = "FAIL";
          break;
        case 1:
          return "+";
        case 2:
          return "-";
        case 3:
          return "*";
        case 4:
          return "/";
        case 5:
          return "=";
        case 6:
          c = nextChar();
          if (c === "=") state = 7;
          else if (c === "EOF") state = "EOF";
          else {
            back();
            state = 8;
          }
          break;
        case 7:
          return "<=";
        case 8:
          return "<";
        case 9:
          c = nextChar();
          if (c === "=") state = 10;
          else if (c === "EOF") state = "EOF";
          else {
            back();
            state = 11;
          }
          break;
        case 10:
          return ">=";
        case 11:
          return ">";
        case "EOF":
          return "EOF";
        default:
          throw "parse error";
      }
    }
  }

  const tokens = [];
  while ((token = nextToken()) !== "EOF") tokens.push(token);
  return tokens;
}

module.exports = lexcial;
