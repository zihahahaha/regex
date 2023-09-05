const { syntaxAnalyzer } = require("./regex/CST");
const { CST2NFA, matchNFA } = require("./regex/NFA");

let CST = syntaxAnalyzer(`(a*)`);

let NFA = CST2NFA(CST);

// console.dir(NFA, { depth: null });

console.log(matchNFA(NFA, `aa`));
