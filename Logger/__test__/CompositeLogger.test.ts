import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.13.0/mod.ts";
import { CompositeLogger } from "../CompositeLogger.ts";
import { Logger } from "../Logger.ts";

function SpyLoggerFactory() {
  class SpyLogger extends Logger {
    public log = spy();
  }

  return new SpyLogger({});
}

Deno.test("CompositeLogger", async (test) => {
  await test.step("should invoke log methods of children", async (test) => {
    await test.step("simple string", () => {
      // Arrange
      const SpyLogger1 = SpyLoggerFactory();
      const SpyLogger2 = SpyLoggerFactory();
      const { log } = new CompositeLogger({
        loggers: [
          SpyLogger1,
          SpyLogger2,
        ],
      });

      // Act
      log`Hello World!`;

      // Assert
      assertSpyCall(SpyLogger1.log, 0, {
        args: [["Hello World!"]],
      });
      assertSpyCall(SpyLogger2.log, 0, {
        args: [["Hello World!"]],
      });
    });

    await test.step("template string", () => {
      // Arrange
      const SpyLogger1 = SpyLoggerFactory();
      const SpyLogger2 = SpyLoggerFactory();
      const { log } = new CompositeLogger({
        loggers: [
          SpyLogger1,
          SpyLogger2,
        ],
      });

      // Act
      log`This is ${true}`;

      // Assert
      assertSpyCall(SpyLogger1.log, 0, {
        args: [["This is ", ""], true],
      });
      assertSpyCall(SpyLogger2.log, 0, {
        args: [["This is ", ""], true],
      });
    });
  });

  await test.step("should not invoke log methods of children when disabled", () => {
    // Arrange
    const SpyLogger1 = SpyLoggerFactory();
    const SpyLogger2 = SpyLoggerFactory();
    const { log } = new CompositeLogger({
      disabled: true,
      loggers: [
        SpyLogger1,
        SpyLogger2,
      ],
    });

    // Act
    log`Hello World!`;

    // Assert
    assertEquals(SpyLogger1.log.calls.length, 0);
    assertEquals(SpyLogger2.log.calls.length, 0);
  });
});
