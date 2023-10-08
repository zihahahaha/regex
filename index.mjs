import { Compiler } from "./compiler.mjs";
import { regex2st } from "./regex/st.mjs";
import { st2nfa, nfaInterpreter } from "./regex/nfa.mjs";
import { nfa2dfa, dfaInterpreter } from "./regex/dfa.mjs";

let a = new Compiler("a|b");

a.transform(regex2st).transform(st2nfa).transform(nfa2dfa);

console.log(dfaInterpreter(a.cache(), "a"));
