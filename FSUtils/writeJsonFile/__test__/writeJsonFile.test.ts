import { stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.13.0/mod.ts";
import { writeJsonFile } from "../writeJsonFile.ts";

Deno.test("writeJsonFile", async (test) => {
  await test.step("should write the stringified JSON object to a file", async () => {
    // Arrange
    const filePath = "config.json";
    const object = {
      some: "value",
      is: true,
    };
    const writeTextFileSpy = spy();
    const writeTextFileStub = stub(Deno, "writeTextFile", writeTextFileSpy);

    // Act
    await writeJsonFile(filePath, object);

    // Assert
    assertSpyCall(writeTextFileSpy, 0, {
      args: [filePath, '{"some":"value","is":true}', undefined],
    });

    // Restore
    writeTextFileStub.restore();
  });

  await test.step("should write the stringified JSON object to a file and pass options to Deno.writeTextFile", async () => {
    // Arrange
    const filePath = "config.json";
    const object = {
      some: "value",
      is: true,
    };
    const abortController = new AbortController();
    const options = {
      signal: abortController.signal,
      create: false,
    };
    const writeTextFileSpy = spy();
    const writeTextFileStub = stub(Deno, "writeTextFile", writeTextFileSpy);

    // Act
    await writeJsonFile(filePath, object, options);

    // Assert
    assertSpyCall(writeTextFileSpy, 0, {
      args: [filePath, '{"some":"value","is":true}', options],
    });

    // Restore
    writeTextFileStub.restore();
  });
});
