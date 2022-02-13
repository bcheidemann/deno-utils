import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { argsFactory } from "../argsFactory.ts";
import {
  AliasedArgOptions,
  AnonymousArgOptions,
  NamedArgOptions,
} from "../types.ts";

Deno.test("argsFactory", async (test) => {
  await test.step(
    "should correctly generate an array of argument opbjects from an array of argument options",
    () => {
      // Arrange
      const namedArgOptions: NamedArgOptions = {
        name: "namedArg",
        type: "named",
        values: ["myNamedDummyValue"],
        equals: true,
      };
      const aliasedArgOptions: AliasedArgOptions = {
        alias: "o",
        type: "aliased",
        values: ["myAliasedDummyValue"],
        equals: true,
      };
      const anonymousArgOptions: AnonymousArgOptions = {
        type: "anonymous",
        value: "myAnonymousDummyValue",
      };

      // Act
      const argObjects = argsFactory(
        namedArgOptions,
        aliasedArgOptions,
        anonymousArgOptions,
      );

      // Assert
      assertEquals(argObjects, [
        {
          ...namedArgOptions,
          args: ["--namedArg=myNamedDummyValue"],
        },
        {
          ...aliasedArgOptions,
          args: ["-o=myAliasedDummyValue"],
        },
        {
          ...anonymousArgOptions,
          args: ["myAnonymousDummyValue"],
        },
      ]);
    },
  );
});
