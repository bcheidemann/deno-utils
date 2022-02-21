import { Logger } from "../../Logger/Logger.ts";

export type Validator<T> = (value: T) => boolean;
export type AssertionOptions<T = unknown> = {
  exitCode?: number;
  logger?: Logger;
  message?: string;
  validator?: Validator<T>;
};
