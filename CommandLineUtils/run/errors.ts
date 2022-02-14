export class PermissonNotGrantedError extends Error {
  constructor() {
    super("Required permissions not granted.");
    this.name = "PermissonNotGrantedError";
  }
}
