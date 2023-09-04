const { regexTokens, syntaxAnalyzer } = require("./regex");

const tokens = regexTokens(`(h*llo)(w*)r(ld)!!`);
console.log(tokens);
syntaxAnalyzer(tokens);
