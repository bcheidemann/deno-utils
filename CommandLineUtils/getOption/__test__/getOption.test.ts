import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { argsFactory } from "../../../utils/test/factories/argsFactory.ts";
import { toArgsArray } from "../../../utils/test/factories/toArgsArray.ts";
import {
  NamedArgOptions,
  AliasedArgOptions,
  ArgOptions,
} from "../../../utils/test/factories/types.ts";
import { getOption } from "../index.ts";

// Mocks
const namedStringArgOptions: NamedArgOptions = {
  name: "namedString",
  type: "named",
  values: ["myNamedStringValue"],
};
const namedNumberArgOptions: NamedArgOptions = {
  name: "namedNumber",
  type: "named",
  values: ["1372"],
};
const namedBooleanArgOptions: NamedArgOptions = {
  name: "namedBoolean",
  type: "named",
  values: ["true"],
};
const aliasedStringArgOptions: AliasedArgOptions = {
  alias: "s",
  type: "aliased",
  values: ["myAliasedStringValue"],
};
const aliasedNumberArgOptions: AliasedArgOptions = {
  alias: "n",
  type: "aliased",
  values: ["3.14"],
};
const aliasedBooleanArgOptions: AliasedArgOptions = {
  alias: "b",
  type: "aliased",
  values: ["true"],
};
const baseArgOptions: Array<ArgOptions> = [
  namedStringArgOptions,
  namedNumberArgOptions,
  namedBooleanArgOptions,
  aliasedStringArgOptions,
  aliasedNumberArgOptions,
  aliasedBooleanArgOptions,
];
const equalsArgOptions = baseArgOptions.map((options) => ({
  ...options,
  equals: options.type !== "anonymous",
}));
const baseArgObjects = argsFactory(...baseArgOptions);
const equalsArgObjects = argsFactory(...equalsArgOptions);
const baseArgs = {
  args: toArgsArray(baseArgObjects),
};
const equalsArgs = {
  args: toArgsArray(equalsArgObjects),
};
const duplicateArgs = {
  args: [...toArgsArray(baseArgObjects), ...toArgsArray(baseArgObjects)],
};

Deno.test("getOption", async (test) => {
  await test.step("should return undefined when no options are passed", () => {
    // Arrange
    const { args } = baseArgs;

    // Act
    const resultString = getOption({
      args,
      type: "string",
    });
    const resultNumber = getOption({
      args,
      type: "number",
    });
    const resultBoolean = getOption({
      args,
      type: "number",
    });

    // Assert
    assertEquals(resultString, undefined);
    assertEquals(resultNumber, undefined);
    assertEquals(resultBoolean, undefined);
  });

  await test.step(
    "should return the correct value when the option is specified in args",
    async (test) => {
      await test.step("equals format", async (test) => {
        await test.step("string type options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "string",
              name: "namedString",
            });

            // Assert
            assertEquals(result, namedStringArgOptions.values[0]);
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "string",
              alias: "s",
            });

            // Assert
            assertEquals(result, aliasedStringArgOptions.values[0]);
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "string",
              name: "namedString",
              alias: "s",
            });

            // Assert
            assertEquals(result, [
              namedStringArgOptions.values[0],
              aliasedStringArgOptions.values[0],
            ]);
          });
        });

        await test.step("number type options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "number",
              name: "namedNumber",
            });

            // Assert
            assertEquals(result, Number(namedNumberArgOptions.values[0]));
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "number",
              alias: "n",
            });

            // Assert
            assertEquals(result, Number(aliasedNumberArgOptions.values[0]));
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "number",
              name: "namedNumber",
              alias: "n",
            });

            // Assert
            assertEquals(result, [
              Number(namedNumberArgOptions.values[0]),
              Number(aliasedNumberArgOptions.values[0])
            ]);
          });
        });

        await test.step("boolean type options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "namedBoolean",
            });

            // Assert
            assertEquals(result, Boolean(namedBooleanArgOptions.values[0]));
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              alias: "b",
            });

            // Assert
            assertEquals(result, Boolean(aliasedBooleanArgOptions.values[0]));
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = baseArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "namedBoolean",
              alias: "n",
            });

            // Assert
            assertEquals(result, [
              Boolean(aliasedBooleanArgOptions.values[0]),
              Boolean(aliasedBooleanArgOptions.values[0]),
            ]);
          });
        });
      });

      await test.step("equals format", async (test) => {
        await test.step("string type options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "string",
              name: "namedString",
            });

            // Assert
            assertEquals(result, namedStringArgOptions.values[0]);
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "string",
              alias: "s",
            });

            // Assert
            assertEquals(result, aliasedStringArgOptions.values[0]);
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "string",
              name: "namedString",
              alias: "s",
            });

            // Assert
            assertEquals(result, [
              namedStringArgOptions.values[0],
              aliasedStringArgOptions.values[0],
            ]);
          });
        });

        await test.step("number type options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "number",
              name: "namedNumber",
            });

            // Assert
            assertEquals(result, Number(namedNumberArgOptions.values[0]));
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "number",
              alias: "n",
            });

            // Assert
            assertEquals(result, Number(aliasedNumberArgOptions.values[0]));
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "number",
              name: "namedNumber",
              alias: "n",
            });

            // Assert
            assertEquals(result, [
              Number(namedNumberArgOptions.values[0]),
              Number(aliasedNumberArgOptions.values[0])
            ]);
          });
        });

        await test.step("boolean type options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "namedBoolean",
            });

            // Assert
            assertEquals(result, Boolean(namedBooleanArgOptions.values[0]));
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              alias: "b",
            });

            // Assert
            assertEquals(result, Boolean(aliasedBooleanArgOptions.values[0]));
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = equalsArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "namedBoolean",
              alias: "n",
            });

            // Assert
            assertEquals(result, [
              Boolean(aliasedBooleanArgOptions.values[0]),
              Boolean(aliasedBooleanArgOptions.values[0]),
            ]);
          });
        });
      });
    }
  );

  await test.step(
    "should return correct default value when the option is not specified in args",
    async (test) => {
      await test.step("string type options", async (test) => {
        await test.step("named option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "string",
            name: "stringOption",
          });

          // Assert
          assertEquals(result, undefined);
        });

        await test.step("aliased option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "string",
            alias: "s",
          });

          // Assert
          assertEquals(result, undefined);
        });

        await test.step("named or aliased option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "string",
            name: "stringOption",
            alias: "s",
          });

          // Assert
          assertEquals(result, undefined);
        });
      });

      await test.step("number type options", async (test) => {
        await test.step("named option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "number",
            name: "numberOption",
          });

          // Assert
          assertEquals(result, undefined);
        });

        await test.step("aliased option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "number",
            alias: "n",
          });

          // Assert
          assertEquals(result, undefined);
        });

        await test.step("named or aliased option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "number",
            name: "numberOption",
            alias: "n",
          });

          // Assert
          assertEquals(result, undefined);
        });
      });

      await test.step("boolean type options", async (test) => {
        await test.step("named option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "boolean",
            name: "booleanOption",
          });

          // Assert
          assertEquals(result, false);
        });

        await test.step("aliased option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "boolean",
            alias: "b",
          });

          // Assert
          assertEquals(result, false);
        });

        await test.step("named or aliased option", () => {
          // Arrange
          const args = new Array<string>();

          // Act
          const result = getOption({
            args,
            type: "boolean",
            name: "booleanOption",
            alias: "n",
          });

          // Assert
          assertEquals(result, false);
        });
      });
    }
  );
});
