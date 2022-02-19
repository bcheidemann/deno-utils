import { templateToString } from "../utils/string/templateToString.ts";
import { SerializableValue } from "../utils/types/serializable.ts";
import { Logger } from "./Logger.ts";
import {
  ILogger,
  TransformableLoggerExtraOptions,
  TransformableLoggerOptions,
} from "./types.ts";

export abstract class TransformableLogger<T = unknown>
  extends Logger<T & TransformableLoggerExtraOptions>
  implements ILogger {
  constructor(options: T & TransformableLoggerOptions) {
    super(options);
  }

  private transformText(text: string) {
    if (this.options.transformText) {
      return this.options.transformText(text);
    }
    return text;
  }

  protected getTextToLog(
    templateStrings: TemplateStringsArray,
    expressions: SerializableValue[],
  ): string {
    const text = templateToString(
      templateStrings,
      ...expressions,
    );
    const transformedText = this.transformText(text);
    return transformedText;
  }
}
