import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import {
  assertSpyCall,
  Spy,
  spy,
} from "https://deno.land/x/mock@0.13.0/mod.ts";
import { ConsoleLogger } from "../ConsoleLogger.ts";

// deno-lint-ignore no-explicit-any
function logSpyFactory(): [Spy<void, any, void>, () => void] {
  const logSpy = spy();
  const logStub = stub(console, "log", logSpy);
  return [logSpy, () => logStub.restore()];
}

Deno.test("ConsoleLogger", async (test) => {
  await test.step("should log to the console", async (test) => {
    await test.step("simple string", () => {
      // Arrange
      const [logSpy, restore] = logSpyFactory();
      const { log } = new ConsoleLogger();

      // Act
      log`Hello World!`;

      // Assert
      assertSpyCall(logSpy, 0, {
        args: ["Hello World!"],
      });

      // Restore
      restore();
    });

    await test.step("template string", () => {
      // Arrange
      const [logSpy, restore] = logSpyFactory();
      const { log } = new ConsoleLogger();

      // Act
      log`This is ${true}`;

      // Assert
      assertSpyCall(logSpy, 0, {
        args: ["This is true"],
      });

      // Restore
      restore();
    });

    await test.step("transformed string", () => {
      // Arrange
      const [logSpy, restore] = logSpyFactory();
      const { log } = new ConsoleLogger({
        transformText: (text) => `Ben said "${text}".`,
      });

      // Act
      log`Hello World!`;

      // Assert
      assertSpyCall(logSpy, 0, {
        args: ['Ben said "Hello World!".'],
      });

      // Restore
      restore();
    });
  });

  await test.step("should not log to the console when disabled", () => {
    // Arrange
    const [logSpy, restore] = logSpyFactory();
    const { log } = new ConsoleLogger({
      disabled: true,
    });

    // Act
    log`Hello World!`;

    // Assert
    assertEquals(logSpy.calls.length, 0);

    // Restore
    restore();
  });
});
