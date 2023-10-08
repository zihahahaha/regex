import { Compiler } from "./compiler.mjs";
import { regex2st } from "./regex/st.mjs";
import { st2nfa, nfaInterpreter } from "./regex/nfa.mjs";

let a = new Compiler("()*");

a.transform(regex2st).transform(st2nfa);

console.log(nfaInterpreter(a.cache(), ""));
