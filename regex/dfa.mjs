class DFAState {
  nfa_states = [];
  transition = {};
  isEnd = false;
  constructor(state) {
    this.nfa_states.push(state);
  }
  closure() {
    for (let i = 0; i < this.nfa_states.length; ++i)
      for (let j = 0; j < this.nfa_states[i].epsilonTransition.length; ++j) {
        const nfa_state = this.nfa_states[i].epsilonTransition[j];
        if (!this.nfa_states.includes(nfa_state)) {
          this.nfa_states.push(nfa_state);
          if(nfa_state.isEnd) this.isEnd = true;
        }
      }
    return this;
  }
  equal(state) {
    if (this.nfa_states.length === state.nfa_states.length) {
      for (let i = 0; i < state.nfa_states.length; ++i) {
        if (!this.nfa_states.includes(state.nfa_states[i])) return false;
      }
      return true;
    } else return false;
  }
}

export function nfa2dfa(nfa) {
  const start = new DFAState(nfa.start).closure();
  const dfa_states = [];
  dfa_states.push(start);

  for (let state of dfa_states) {
    for (let nfa_state of state.nfa_states) {
      for (let symbol in nfa_state.transition) {
        const next_nfa_state = nfa_state.transition[symbol];
        if (state.transition[symbol]) {
          if (!state.transition[symbol].nfa_states.includes(next_nfa_state)) {
            state.transition[symbol].nfa_states.push(next_nfa_state);
            if (next_nfa_state.isEnd) state.transition[symbol] = true;
          }
        } else {
          state.transition[symbol] = new DFAState(next_nfa_state);
          if (next_nfa_state.isEnd) state.transition[symbol].isEnd = true;
        }
      }
    }
    for (let symbol in state.transition) {
      state.transition[symbol].closure();
      if (state.equal(state.transition[symbol]))
        state.transition[symbol] = state;
      else dfa_states.push(state.transition[symbol]);
    }
  }

  return start;
}

export function dfaInterpreter(dfa, input) {
  for (let symbol of input) {
    if (dfa.transition[symbol]) dfa = dfa.transition[symbol];
    else return false;
  }
  if (dfa.isEnd) return true;
  else return false;
}
