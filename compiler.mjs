export class Compiler {
  #cache;
  constructor(src) {
    this.#cache = src;
  }
  transform(transformer) {
    this.#cache = transformer(this.#cache);
    return this;
  }
  interprete(interpreter, ...args) {
    return interpreter(this.#cache, ...args);
  }
  cache() {
    return this.#cache;
  }
}
