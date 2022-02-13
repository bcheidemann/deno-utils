import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { argsFactory } from "../../../utils/test/factories/argsFactory.ts";
import { toArgsArray } from "../../../utils/test/factories/toArgsArray.ts";
import {
  NamedArgOptions,
  AliasedArgOptions,
  ArgOptions,
  AnonymousArgOptions,
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
  equals: true, // Must be equals format because --booleanValue false would be interpreted as booleanValue=true and an anonymous option of "false"
  type: "named",
  values: ["false"],
};
const implicitNamedBooleanArg: AnonymousArgOptions = {
  type: "anonymous",
  value: "--implicitNamedBoolean",
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
  equals: true, // Must be equals format because --booleanValue false would be interpreted as booleanValue=true and an anonymous option of "false"
  type: "aliased",
  values: ["false"],
};
const implicitAliasedBooleanArgOptions: AnonymousArgOptions = {
  type: "anonymous",
  value: "-ib",
};
const baseArgOptions: Array<ArgOptions> = [
  namedStringArgOptions,
  namedNumberArgOptions,
  aliasedStringArgOptions,
  aliasedNumberArgOptions,
];
const booleanArgOptions: Array<ArgOptions> = [
  namedBooleanArgOptions,
  implicitNamedBooleanArg,
  aliasedBooleanArgOptions,
  implicitAliasedBooleanArgOptions,
];
const equalsArgOptions = baseArgOptions.map((options) => ({
  ...options,
  equals: options.type !== "anonymous",
}));
const baseArgObjects = argsFactory(...baseArgOptions);
const equalsArgObjects = argsFactory(...equalsArgOptions);
const booleanArgObjects = argsFactory(...booleanArgOptions);
const baseArgs = {
  args: toArgsArray(baseArgObjects),
};
const equalsArgs = {
  args: toArgsArray(equalsArgObjects),
};
const booleanArgs = {
  args: toArgsArray(booleanArgObjects),
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
      await test.step("separated format", async (test) => {
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
              Number(aliasedNumberArgOptions.values[0]),
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
              Number(aliasedNumberArgOptions.values[0]),
            ]);
          });
        });
      });

      await test.step("boolean type options", async (test) => {
        await test.step("explicit boolean options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = booleanArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "namedBoolean",
            });

            // Assert
            assertEquals(result, namedBooleanArgOptions.values[0] === "true");
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = booleanArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              alias: "b",
            });

            // Assert
            assertEquals(result, aliasedBooleanArgOptions.values[0] === "true");
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = booleanArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "namedBoolean",
              alias: "b",
            });

            // Assert
            assertEquals(result, [
              namedBooleanArgOptions.values[0] === "true",
              aliasedBooleanArgOptions.values[0] === "true",
            ]);
          });
        });

        await test.step("implicit boolean options", async (test) => {
          await test.step("named option", () => {
            // Arrange
            const { args } = booleanArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "implicitNamedBoolean",
            });

            // Assert
            assertEquals(result, true);
          });

          await test.step("aliased option", () => {
            // Arrange
            const { args } = booleanArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              alias: "ib",
            });

            // Assert
            assertEquals(result, true);
          });

          await test.step("named or aliased option", () => {
            // Arrange
            const { args } = booleanArgs;

            // Act
            const result = getOption({
              args,
              type: "boolean",
              name: "implicitNamedBoolean",
              alias: "ib",
            });

            // Assert
            assertEquals(result, [true, true]);
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
