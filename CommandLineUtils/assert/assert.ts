import { ConsoleLogger } from "../../Logger/ConsoleLogger.ts";
import { AssertionOptions } from "./types.ts";

export const AssertionValidators = {
  assertTruthy(value: unknown) {
    return Boolean(value);
  },
};

export function createAssertion<T = unknown>(
  options?: AssertionOptions<T>,
) {
  return async function assert(
    value: T,
    overrides: Partial<AssertionOptions<T>> = {},
  ): Promise<void> {
    const mergedOptions = {
      ...options,
      ...overrides,
    };
    const exitCode = typeof mergedOptions.exitCode === "undefined"
      ? 1
      : mergedOptions.exitCode;
    const logger = mergedOptions.logger || new ConsoleLogger();
    const message = mergedOptions.message;
    const validator = mergedOptions.validator ||
      AssertionValidators.assertTruthy;

    const isValidated = validator(value);
    if (!isValidated) {
      typeof message !== "undefined" && await logger.log`${message}`;
      Deno.exit(exitCode);
    }
  };
}

export const assert = createAssertion();
