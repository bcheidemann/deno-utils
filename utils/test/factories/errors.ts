export class InvalidOptionsError extends Error {
  constructor() {
    super("Invalid options error.");
    this.name = "InvalidOptionsError";
  }
}
