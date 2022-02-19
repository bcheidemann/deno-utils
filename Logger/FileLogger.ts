import { SerializableValue } from "../utils/types/serializable.ts";
import { TransformableLogger } from "./TransformableLogger.ts";
import { FileLoggerExtraOptions, FileLoggerOptions, ILogger } from "./types.ts";

export class FileLogger extends TransformableLogger<FileLoggerExtraOptions>
  implements ILogger {
  constructor(options: FileLoggerOptions) {
    super(options);
  }

  private permissions = Deno.permissions.request({
    name: "write",
    path: this.options.logFile,
  });

  public log = async (
    templateStrings: TemplateStringsArray,
    ...expressions: SerializableValue[]
  ): Promise<void> => {
    if (this.options.disabled) return;
    const textToLog = this.getTextToLog(templateStrings, expressions);
    await this.permissions;
    await Deno.writeTextFile(this.options.logFile, `${textToLog}\n`, {
      append: true,
      create: true,
      ...this.options.writeFileOptions,
    });
  };
}
