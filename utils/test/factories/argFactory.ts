import { InvalidOptionsError } from "./errors.ts";
import {
  AliasedArgObject,
  AliasedArgOptions,
  AnonymousArgObject,
  AnonymousArgOptions,
  ArgObject,
  NamedArgObject,
  NamedArgOptions,
  ArgOptions,
} from "./types.ts";

export function namedArgFactory(options: NamedArgOptions): NamedArgObject {
  return {
    ...options,
    equals: Boolean(options.equals),
    args: options.values
      .map(
        options.equals
          ? (value) => [`--${options.name}=${value}`]
          : (value) => [`--${options.name}`, `${value}`]
      )
      .flat(),
  };
}

export function aliasedArgFactory(
  options: AliasedArgOptions
): AliasedArgObject {
  return {
    ...options,
    equals: Boolean(options.equals),
    args: options.values
      .map(
        options.equals
          ? (value) => [`-${options.alias}=${value}`]
          : (value) => [`-${options.alias}`, `${value}`]
      )
      .flat(),
  };
}

export function anonymousArgFactory(
  options: AnonymousArgOptions
): AnonymousArgObject {
  return {
    ...options,
    args: [`${options.value}`],
  };
}

export function argFactory<T extends ArgOptions>(options: T): ArgObject<T> {
  switch (options.type) {
    case "named":
      return namedArgFactory(options) as unknown as ArgObject<T>;
    case "aliased":
      return aliasedArgFactory(options) as unknown as ArgObject<T>;
    case "anonymous":
      return anonymousArgFactory(options) as unknown as ArgObject<T>;
    default:
      throw new InvalidOptionsError();
  }
}
