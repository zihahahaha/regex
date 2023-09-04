const { regexTokens, syntaxAnalyzer } = require("./regex");

const tokens = regexTokens(`a(aaa)*`);
console.log(tokens);
syntaxAnalyzer(tokens);

