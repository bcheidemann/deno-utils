export type Type =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

export class SerializationError extends Error {
  constructor(type: Type) {
    super(`Unable to serialize type "${type}".`);
    this.name = "SerializationError";
  }
}
