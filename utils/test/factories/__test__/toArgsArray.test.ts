import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { argsFactory } from "../argsFactory.ts";
import { toArgsArray } from "../toArgsArray.ts";
import {
  AliasedArgOptions,
  AnonymousArgOptions,
  NamedArgOptions,
} from "../types.ts";

Deno.test("toArgsArray", async (test) => {
  await test.step(
    "should correctly convert an array of args object to an array of args",
    () => {
      // Arrange
      const namedArgOptions1: NamedArgOptions = {
        name: "namedArg",
        type: "named",
        values: ["myNamedDummyValue"],
        equals: false,
      };
      const namedArgOptions2: NamedArgOptions = {
        name: "namedArg",
        type: "named",
        values: ["myNamedDummyValue"],
        equals: true,
      };
      const aliasedArgOptions1: AliasedArgOptions = {
        alias: "o",
        type: "aliased",
        values: ["myAliasedDummyValue"],
        equals: false,
      };
      const aliasedArgOptions2: AliasedArgOptions = {
        alias: "o",
        type: "aliased",
        values: ["myAliasedDummyValue"],
        equals: true,
      };
      const anonymousArgOptions: AnonymousArgOptions = {
        type: "anonymous",
        value: "myAnonymousDummyValue",
      };
      const argObjects = argsFactory(
        namedArgOptions1,
        namedArgOptions2,
        aliasedArgOptions1,
        aliasedArgOptions2,
        anonymousArgOptions,
      );

      // Act
      const args = toArgsArray(argObjects);

      // Assert
      assertEquals(args, [
        "--namedArg",
        "myNamedDummyValue",
        "--namedArg=myNamedDummyValue",
        "-o",
        "myAliasedDummyValue",
        "-o=myAliasedDummyValue",
        "myAnonymousDummyValue",
      ]);
    },
  );
});
