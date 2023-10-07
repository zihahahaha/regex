// 使用语法树构建nfa

import { TYPE } from "./st.mjs";

class State {
  isEnd;
  transition = {};
  epsilonTransition = [];
  constructor(isEnd) {
    this.isEnd = isEnd;
  }
  transitionTo(state, symbol) {
    this.transition[symbol] = state;
  }
  epsilonTransitionTo(state) {
    this.epsilonTransition.push(state);
  }
}

class NFA {
  start;
  end;
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

function contact(nfa1, nfa2) {
  nfa1.end.epsilonTransitionTo(nfa2.start);
  nfa1.end.isEnd = false;
  return new NFA(nfa1.start, nfa2.end);
}

function union(nfa1, nfa2) {
  const start = new State(false);
  const end = new State(true);
  start.epsilonTransitionTo(nfa1.start);
  start.epsilonTransitionTo(nfa2.start);
  nfa1.end.epsilonTransitionTo(end);
  nfa1.end.isEnd = false;
  nfa2.end.epsilonTransitionTo(end);
  nfa2.end.isEnd = false;
  return new NFA(start, end);
}

function quantifierZero2Inifity(nfa) {
  const start = new State(false);
  const end = new State(true);
  nfa.end.epsilonTransitionTo(nfa.start);
  start.epsilonTransitionTo(nfa.start);
  nfa.end.epsilonTransitionTo(end);
  start.epsilonTransitionTo(end);
  nfa.end.isEnd = false;
  return new NFA(start, end);
}

function base(node) {
  const start = new State(false);
  const end = new State(true);
  if (node.value === "") start.epsilonTransitionTo(end);
  else start.transitionTo(end, node.value);
  return new NFA(start, end);
}

export function st2nfa(node) {
  let nfa;
  switch (node.type) {
    case TYPE.EXPR:
      nfa = st2nfa(node.children[0]);
      for (let i = 1; i < node.children.length; ++i) {
        nfa = union(nfa, st2nfa(node.children[i]));
      }
      return nfa;
    case TYPE.TERM:
      nfa = st2nfa(node.children[0]);
      for (let i = 1; i < node.children.length; ++i) {
        nfa = contact(nfa, st2nfa(node.children[i]));
      }
      return nfa;
    case TYPE.FACTOR:
      if (node.children.length === 2) {
        if (node.children[1].value === "*")
          return quantifierZero2Inifity(st2nfa(node.children[0]));
        else if (node.children[1].value === "+") {
        } else {
        }
      } else return st2nfa(node.children[0]);
    case TYPE.ATOM:
      if (node.children.length === 3) return st2nfa(node.children[1]);
      else return base(node.children[0]);
  }
}

export function nfaInterpreter(nfa, input) {
  function find(state, index) {
    for (let i = index; i < input.length; ++i) {
      if (state.transition[input[i]]) {
        if (find(state.transition[input[i]], index + 1)) return true;
      } else if (state.epsilonTransition.length > 0) {
        for (let j = 0; j < state.epsilonTransition.length; ++j)
          if (find(state.epsilonTransition[j], index)) return true;
      }
    }
    for (let j = 0; j < state.epsilonTransition.length; ++j)
      if (find(state.epsilonTransition[j], index)) return true;

    if (state.isEnd) return true;
    else return false;
  }

  return find(nfa.start, 0);
}
