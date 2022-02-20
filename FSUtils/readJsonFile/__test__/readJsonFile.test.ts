import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.13.0/mod.ts";
import { readJsonFile } from "../readJsonFile.ts";

Deno.test("readJsonFile", async (test) => {
  await test.step("should return the parsed JSON contents of a file", async () => {
    // Arrange
    const filePath = "config.json";
    const textContent = `{
      "some": "value",
      "is": true
    }`;
    const readTextFileSpy = spy(() => textContent);
    const reatTextFileStub = stub(Deno, "readTextFile", readTextFileSpy);

    // Act
    const result = await readJsonFile(filePath);

    // Assert
    assertSpyCall(readTextFileSpy, 0, {
      args: [filePath, undefined],
    });
    assertEquals(result, {
      some: "value",
      is: true,
    });

    // Restore
    reatTextFileStub.restore();
  });

  await test.step("should return the parsed JSON contents of a file and pass options to Deno.readTextFile", async () => {
    // Arrange
    const filePath = "config.json";
    const textContent = `{
      "some": "value",
      "is": true
    }`;
    const abortController = new AbortController();
    const options = {
      signal: abortController.signal,
    };
    const readTextFileSpy = spy(() => textContent);
    const reatTextFileStub = stub(Deno, "readTextFile", readTextFileSpy);

    // Act
    const result = await readJsonFile(filePath, options);

    // Assert
    assertSpyCall(readTextFileSpy, 0, {
      args: [filePath, options],
    });
    assertEquals(result, {
      some: "value",
      is: true,
    });

    // Restore
    reatTextFileStub.restore();
  });
});
