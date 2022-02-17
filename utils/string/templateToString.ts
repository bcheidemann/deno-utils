import { SerializationError } from "../errors/SerializationError.ts";
import { SerializableValue } from "../types/serializable.ts";

function stringifyExpression(expression: SerializableValue) {
  switch (typeof expression) {
    case "object":
      return JSON.stringify(expression);
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return String(expression);
    default:
      throw new SerializationError(typeof expression);
  }
}

export function templateToString(
  templateStrings: TemplateStringsArray,
  ...expressions: SerializableValue[]
) {
  return templateStrings
    .map((
      templateString,
      i,
    ) => [templateString, stringifyExpression(expressions[i])]) // TODO: stringify objects
    .flat()
    .splice(0, templateStrings.length + expressions.length)
    .join("");
}
