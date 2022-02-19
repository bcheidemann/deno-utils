import { SerializableValue } from "../utils/types/serializable.ts";
import { TransformableLogger } from "./TransformableLogger.ts";
import {
  ConsoleLoggerExtraOptions,
  ConsoleLoggerOptions,
  ILogger,
} from "./types.ts";

export class ConsoleLogger
  extends TransformableLogger<ConsoleLoggerExtraOptions>
  implements ILogger {
  constructor(options: ConsoleLoggerOptions = {}) {
    super(options);
  }

  public log = (
    templateStrings: TemplateStringsArray,
    ...expressions: SerializableValue[]
  ): void => {
    if (this.options.disabled) return;
    const textToLog = this.getTextToLog(templateStrings, expressions);
    console.log(textToLog);
  };
}
