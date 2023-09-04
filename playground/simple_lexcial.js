function simple_lexical(str) {
  tokens = [];
  for (let i = 0; i < str.length; ) {
    if (
      str[i] === "+" ||
      str[i] === "-" ||
      str[i] === "*" ||
      str[i] === "/" ||
      str[i] === "="
    ) {
      tokens.push(str[i++]);
    }
    if (str[i] === "<") {
      if (str[i + 1] === "=") {
        tokens.push("<=");
        i += 2;
      } else tokens.push(str[i++]);
    }
    if (str[i] === ">") {
      if (str[i + 1] === "=") {
        tokens.push(">=");
        i += 2;
      } else tokens.push(str[i++]);
    }
    if (str[i] === " ") i++;
  }
  return tokens;
}

module.exports = simple_lexical;
