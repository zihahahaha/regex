// dfs CST构建CST2NFA
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

function series(nfa1, nfa2) {
  nfa1.end.epsilonTransitionTo(nfa2.start);
  nfa1.end.isEnd = false;
  return new NFA(nfa1.start, nfa2.end);
}

function parallel(nfa1, nfa2) {
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

function kleene(nfa) {
  const start = new State(false);
  const end = new State(true);
  nfa.end.epsilonTransitionTo(nfa.start);
  start.epsilonTransitionTo(nfa.start);
  nfa.end.epsilonTransitionTo(end);
  start.epsilonTransitionTo(end);
  nfa.end.isEnd = false;
  return new NFA(start, end);
}

function CST2NFA(node) {
  if (node.label === "expr") {
    const term = CST2NFA(node.children[0]);
    if (node.children.length === 3) {
      return parallel(term, CST2NFA(node.children[2]));
    } else return term;
  } else if (node.label === "term") {
    const factor = CST2NFA(node.children[0]);
    if (node.children.length === 2) {
      return series(factor, CST2NFA(node.children[1]));
    } else return factor;
  } else if (node.label === "factor") {
    const atom = CST2NFA(node.children[0]);
    if (node.children.length === 2) {
      return kleene(atom);
    } else return atom;
  } else if (node.label === "atom") {
    if (node.children.length === 3) {
      return CST2NFA(node.children[1]);
    } else {
      const start = new State(false);
      const end = new State(true);
      start.transitionTo(end, node.children[0].label);
      return new NFA(start, end);
    }
  }
}

function matchNFA(nfa, string) {
  function search(state, index) {
    if (string.length == index) return true;
    const c = string[index];
    for (let symbol in state.transition) {
      if (symbol === c)
        if (search(state.transition[symbol], index + 1)) return true;
    }
    for (let i = 0; i < state.epsilonTransition.length; ++i) {
      if (search(state.epsilonTransition[i], index)) return true;
    }
    return false;
  }
  return search(nfa.start, 0);
}

module.exports = {
  CST2NFA,
  matchNFA,
};
