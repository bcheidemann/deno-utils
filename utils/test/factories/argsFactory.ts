import { argFactory } from "./argFactory.ts";
import { ArgOptions, ArgObject } from "./types.ts";

export function argsFactory(
  ...options: Array<ArgOptions>
): Array<ArgObject<ArgOptions>> {
  return options.map(argFactory);
}
