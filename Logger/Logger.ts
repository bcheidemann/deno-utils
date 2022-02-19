import { SerializableValue } from "../utils/types/serializable.ts";
import { ILogger, LoggerOptions } from "./types.ts";

export abstract class Logger<T = unknown> implements ILogger {
  constructor(protected options: LoggerOptions<T>) {}
  public abstract log(
    templateStrings: TemplateStringsArray,
    ...expressions: SerializableValue[]
  ): void | Promise<void>;
}
