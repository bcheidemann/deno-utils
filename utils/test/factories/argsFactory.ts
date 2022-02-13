import { argFactory } from "./argFactory.ts";
import { ArgObject, ArgOptions } from "./types.ts";

export function argsFactory(
  ...options: Array<ArgOptions>
): Array<ArgObject<ArgOptions>> {
  return options.map(argFactory);
}
