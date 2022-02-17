import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { SerializationError } from "../../errors/SerializationError.ts";
import { templateToString } from "../templateToString.ts";

Deno.test("templateToString", async (test) => {
  await test.step("should correctly convert basic template string literal to a string", () => {
    // Act
    const result = templateToString`some basic test string`;

    // Assert
    assertEquals(result, "some basic test string");
  });

  await test.step("should correctly convert a complex template string literal to a string", () => {
    // Arrange
    const objectValue = {
      key1: "string",
      key2: null,
      key3: false,
    };
    const arrayValue = [1, 2, 3];
    const nullValue = null;
    const booleanValue = true;
    const numberValue = 123;
    const stringValue = "Hello World!";
    const undefinedValue = undefined;

    // Act
    const result = templateToString
      `objectValue = ${objectValue}, arrayValue = ${arrayValue}, nullValue = ${nullValue}, booleanValue = ${booleanValue}, numberValue = ${numberValue}, stringValue = ${stringValue}, undefinedValue = ${undefinedValue}`;

    // Assert
    assertEquals(
      result,
      'objectValue = {"key1":"string","key2":null,"key3":false}, arrayValue = [1,2,3], nullValue = null, booleanValue = true, numberValue = 123, stringValue = Hello World!, undefinedValue = undefined',
    );
  });

  await test.step("should throw a SerializationError if an invalud value is included in the template string literal", async () => {
    // Arrange
    const invalidValue = () => {};

    // Act
    // deno-lint-ignore require-await
    async function act() {
      templateToString`invalidValue = ${invalidValue as unknown}`;
    }

    // Assert
    await assertRejects(
      act,
      SerializationError,
      'Unable to serialize type "function".',
    );
  });
});
