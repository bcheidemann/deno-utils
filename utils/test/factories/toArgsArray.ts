import { ArgObject, ArgOptions } from "./types.ts";

export function toArgsArray(
  argObjects: Array<ArgObject<ArgOptions>>
): Array<string> {
  return argObjects.map((argObject) => argObject.args).flat();
}
