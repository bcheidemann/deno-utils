import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import {
  assertSpyCall,
  Spy,
  spy,
} from "https://deno.land/x/mock@0.13.0/mod.ts";
import { assert, createAssertion } from "../assert.ts";
import { Logger } from "../../../Logger/Logger.ts";
import { AssertionOptions } from "../types.ts";

// deno-lint-ignore no-explicit-any
function logSpyFactory(): [Spy<void, any[], any>, () => void] {
  const logSpy = spy();
  const logStub = stub(console, "log", logSpy);
  return [logSpy, () => logStub.restore()];
}

// deno-lint-ignore no-explicit-any
function exitSpyFactory(): [Spy<void, any[], any>, () => void] {
  const exitSpy = spy();
  const exitStub = stub(Deno, "exit", exitSpy);
  return [exitSpy, () => exitStub.restore()];
}

function SpyLoggerFactory() {
  class SpyLogger extends Logger {
    public log = spy();
  }

  return new SpyLogger({});
}

Deno.test("createAssertion", async (test) => {
  await test.step("default assert", async (test) => {
    await test.step("should call log and exit when assertion fails", async () => {
      // Arrange
      const [logSpy, logRestore] = logSpyFactory();
      const [exitSpy, exitRestore] = exitSpyFactory();
      const message = "Hello World!";

      // Act
      await assert(false, { message });

      // Assert
      assertSpyCall(logSpy, 0, {
        args: [message],
      });
      assertSpyCall(exitSpy, 0, {
        args: [1],
      });

      // Restore
      logRestore();
      exitRestore();
    });

    await test.step("should call only exit when assertion fails and no message is provided", async () => {
      // Arrange
      const [logSpy, logRestore] = logSpyFactory();
      const [exitSpy, exitRestore] = exitSpyFactory();

      // Act
      await assert(false);

      // Assert
      assertEquals(logSpy.calls.length, 0);
      assertSpyCall(exitSpy, 0, {
        args: [1],
      });

      // Restore
      logRestore();
      exitRestore();
    });

    await test.step("should not call log or exit when assertion passes", async () => {
      // Arrange
      const [logSpy, logRestore] = logSpyFactory();
      const [exitSpy, exitRestore] = exitSpyFactory();
      const message = "Hello World!";

      // Act
      await assert(true, { message });

      // Assert
      assertEquals(logSpy.calls.length, 0);
      assertEquals(exitSpy.calls.length, 0);

      // Restore
      logRestore();
      exitRestore();
    });
  });

  await test.step("custom assert", async () => {
    // Arrange
    const [exitSpy, exitRestore] = exitSpyFactory();
    const logger = SpyLoggerFactory();
    const assertionOptions: AssertionOptions = {
      exitCode: 42,
      logger,
      message: "Hello World!",
      validator: spy(() => false),
    };
    const assert = createAssertion(assertionOptions);
    const testValue = "Test Value";

    // Act
    await assert(testValue);

    // Assert
    assertSpyCall(
      assertionOptions.validator as Spy<void, [value: unknown], boolean>,
      0,
      {
        args: [testValue],
      },
    );
    assertSpyCall(logger.log, 0, {
      args: [["", ""], assertionOptions.message],
    });
    assertSpyCall(exitSpy, 0, {
      args: [42],
    });

    // Restore
    exitRestore();
  });
});
