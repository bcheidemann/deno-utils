import { SerializableValue } from "../utils/types/serializable.ts";

export type LoggerOptions<T = never> = {
  disabled?: boolean;
} & T;

export type BaseLoggerOptions = LoggerOptions;

export type CompositeLoggerExtraOptions = {
  loggers: Array<ILogger>;
};
export type CompositeLoggerOptions = LoggerOptions<CompositeLoggerExtraOptions>;

export type TransformableLoggerExtraOptions = {
  transformText?: (text: string) => string;
};
export type TransformableLoggerOptions = LoggerOptions<
  ConsoleLoggerExtraOptions
>;

export type ConsoleLoggerExtraOptions = TransformableLoggerExtraOptions;
export type ConsoleLoggerOptions = LoggerOptions<ConsoleLoggerExtraOptions>;

export type FileLoggerExtraOptions = TransformableLoggerExtraOptions & {
  logFile: string;
  writeFileOptions?: Deno.WriteFileOptions;
};
export type FileLoggerOptions = LoggerOptions<FileLoggerExtraOptions>;

export interface ILogger {
  log(
    templateStrings: TemplateStringsArray,
    ...expressions: SerializableValue[]
  ): void | Promise<void>;
}
