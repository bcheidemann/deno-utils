import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.13.0/mod.ts";
import { readJsonFileSync } from "../readJsonFileSync.ts";

Deno.test("readJsonFileSync", async (test) => {
  await test.step("should return the parsed JSON contents of a file", () => {
    // Arrange
    const filePath = "config.json";
    const textContent = `{
      "some": "value",
      "is": true
    }`;
    const readTextFileSyncSpy = spy(() => textContent);
    const reatTextFileSyncStub = stub(
      Deno,
      "readTextFileSync",
      readTextFileSyncSpy,
    );

    // Act
    const result = readJsonFileSync(filePath);

    // Assert
    assertSpyCall(readTextFileSyncSpy, 0, {
      args: [filePath],
    });
    assertEquals(result, {
      some: "value",
      is: true,
    });

    // Restore
    reatTextFileSyncStub.restore();
  });
});
