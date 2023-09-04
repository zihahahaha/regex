const { regexTokens, syntaxAnalyzer } = require("./regex");

const tokens = regexTokens(`a*aa(b)a*`);
console.log(tokens);
syntaxAnalyzer(tokens);

