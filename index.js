const { regexTokens, syntaxAnalyzer } = require("./regex");

const tokens = regexTokens(`a|(bc)*`);
console.log(tokens);
syntaxAnalyzer(tokens);

