import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import {
  aliasedArgFactory,
  anonymousArgFactory,
  namedArgFactory,
} from "../argFactory.ts";
import {
  AliasedArgOptions,
  AnonymousArgOptions,
  NamedArgOptions,
} from "../types.ts";

Deno.test("argFactory", async (test) => {
  await test.step("should correctly generate named args", () => {
    // Arrange
    const options: NamedArgOptions = {
      name: "myTestArg",
      type: "named",
      values: ["myDummyValue"],
    };

    // Act
    const argObj = namedArgFactory(options);

    // Assert
    assertEquals(argObj, {
      ...options,
      equals: false,
      args: ["--myTestArg", "myDummyValue"],
    });
  });

  await test.step("should correctly generate named args with equals format", () => {
    // Arrange
    const options: NamedArgOptions = {
      name: "myTestArg",
      equals: true,
      type: "named",
      values: ["myDummyValue"],
    };

    // Act
    const argObj = namedArgFactory(options);

    // Assert
    assertEquals(argObj, {
      ...options,
      args: ["--myTestArg=myDummyValue"],
    });
  });

  await test.step(
    "should correctly generate named args with multiple values",
    () => {
      // Arrange
      const options: NamedArgOptions = {
        name: "myTestArg",
        type: "named",
        values: ["myDummyValue1", "myDummyValue2", "myDummyValue3"],
      };

      // Act
      const argObj = namedArgFactory(options);

      // Assert
      assertEquals(argObj, {
        ...options,
        equals: false,
        args: [
          "--myTestArg",
          "myDummyValue1",
          "--myTestArg",
          "myDummyValue2",
          "--myTestArg",
          "myDummyValue3",
        ],
      });
    },
  );

  await test.step("should correctly generate aliased args", () => {
    // Arrange
    const options: AliasedArgOptions = {
      alias: "o",
      type: "aliased",
      values: ["myDummyValue"],
    };

    // Act
    const argObj = aliasedArgFactory(options);

    // Assert
    assertEquals(argObj, {
      ...options,
      equals: false,
      args: ["-o", "myDummyValue"],
    });
  });

  await test.step("should correctly generate aliased args with equals format", () => {
    // Arrange
    const options: AliasedArgOptions = {
      alias: "o",
      equals: true,
      type: "aliased",
      values: ["myDummyValue"],
    };

    // Act
    const argObj = aliasedArgFactory(options);

    // Assert
    assertEquals(argObj, {
      ...options,
      args: ["-o=myDummyValue"],
    });
  });

  await test.step(
    "should correctly generate aliased args with multiple values",
    () => {
      // Arrange
      const options: AliasedArgOptions = {
        alias: "o",
        type: "aliased",
        values: ["myDummyValue1", "myDummyValue2", "myDummyValue3"],
      };

      // Act
      const argObj = aliasedArgFactory(options);

      // Assert
      assertEquals(argObj, {
        ...options,
        equals: false,
        args: [
          "-o",
          "myDummyValue1",
          "-o",
          "myDummyValue2",
          "-o",
          "myDummyValue3",
        ],
      });
    },
  );

  await test.step("should correctly generate anonymous args", () => {
    // Arrange
    const options: AnonymousArgOptions = {
      type: "anonymous",
      value: "myDummyValue",
    };

    // Act
    const argObj = anonymousArgFactory(options);

    // Assert
    assertEquals(argObj, {
      ...options,
      args: ["myDummyValue"],
    });
  });
});
