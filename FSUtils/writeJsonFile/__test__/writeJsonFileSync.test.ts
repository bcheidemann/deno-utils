import { stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.13.0/mod.ts";
import { writeJsonFileSync } from "../writeJsonFileSync.ts";

Deno.test("writeJsonFileSync", async (test) => {
  await test.step("should write the stringified JSON object to a file", () => {
    // Arrange
    const filePath = "config.json";
    const object = {
      some: "value",
      is: true,
    };
    const writeTextFileSyncSpy = spy();
    const writeTextFileSyncStub = stub(
      Deno,
      "writeTextFileSync",
      writeTextFileSyncSpy,
    );

    // Act
    writeJsonFileSync(filePath, object);

    // Assert
    assertSpyCall(writeTextFileSyncSpy, 0, {
      args: [filePath, '{"some":"value","is":true}', undefined],
    });

    // Restore
    writeTextFileSyncStub.restore();
  });

  await test.step("should write the stringified JSON object to a file and pass options to Deno.writeTextFile", () => {
    // Arrange
    const filePath = "config.json";
    const object = {
      some: "value",
      is: true,
    };
    const options = {
      create: false,
    };
    const writeTextFileSyncSpy = spy();
    const writeTextFileSyncStub = stub(
      Deno,
      "writeTextFileSync",
      writeTextFileSyncSpy,
    );

    // Act
    writeJsonFileSync(filePath, object, options);

    // Assert
    assertSpyCall(writeTextFileSyncSpy, 0, {
      args: [filePath, '{"some":"value","is":true}', options],
    });

    // Restore
    writeTextFileSyncStub.restore();
  });
});
