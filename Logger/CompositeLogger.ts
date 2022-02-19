import { SerializableValue } from "../utils/types/serializable.ts";
import { Logger } from "./Logger.ts";
import {
  CompositeLoggerExtraOptions,
  CompositeLoggerOptions,
  ILogger,
} from "./types.ts";

export class CompositeLogger extends Logger<CompositeLoggerExtraOptions>
  implements ILogger {
  constructor(options: CompositeLoggerOptions) {
    super(options);
  }

  public log = async (
    templateStrings: TemplateStringsArray,
    ...expressions: SerializableValue[]
  ) => {
    if (this.options.disabled) return;
    await Promise.all(
      this.options.loggers.map((logger) =>
        logger.log(templateStrings, ...expressions)
      ),
    );
  };
}
