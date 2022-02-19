import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import {
  assertSpyCall,
  Spy,
  spy,
} from "https://deno.land/x/mock@0.13.0/mod.ts";
import { FileLogger } from "../FileLogger.ts";

type permissionsRequestSpy = Spy<
  void,
  [desc: Deno.PermissionDescriptor],
  Promise<Deno.PermissionStatus>
>;
function permissionsRequestSpyFactory(): [permissionsRequestSpy, () => void] {
  const permissionsRequestSpy = spy();
  const permissionsRequestStub = stub(
    Deno.permissions,
    "request",
    permissionsRequestSpy,
  );
  return [permissionsRequestSpy, () => permissionsRequestStub.restore()];
}

type WriteTextFileSpy = Spy<
  void,
  [
    path: string | URL,
    data: string,
    options?: Deno.WriteFileOptions | undefined,
  ],
  Promise<void>
>;
function writeTextFileSpyFactory(): [WriteTextFileSpy, () => void] {
  const writeTextFileSpy = spy();
  const writeTextFileStub = stub(Deno, "writeTextFile", writeTextFileSpy);
  return [writeTextFileSpy, () => writeTextFileStub.restore()];
}

Deno.test("FileLogger", async (test) => {
  await test.step("should log to a file", async (test) => {
    await test.step("simple string", async () => {
      // Arrange
      const [permissionsRequestSpy, restorePermissionsRequest] =
        permissionsRequestSpyFactory();
      const [writeTextFileSpy, restoreWriteTextFile] =
        writeTextFileSpyFactory();
      const logFile = "log.txt";
      const { log } = new FileLogger({
        logFile,
      });

      // Act
      await log`Hello World!`;

      // Assert
      assertSpyCall(permissionsRequestSpy, 0, {
        args: [{
          name: "write",
          path: logFile,
        }],
      });
      assertSpyCall(writeTextFileSpy, 0, {
        args: [logFile, "Hello World!\n", {
          append: true,
          create: true,
        }],
      });

      // Restore
      restorePermissionsRequest();
      restoreWriteTextFile();
    });

    await test.step("template string", async () => {
      // Arrange
      const [permissionsRequestSpy, restorePermissionsRequest] =
        permissionsRequestSpyFactory();
      const [writeTextFileSpy, restoreWriteTextFile] =
        writeTextFileSpyFactory();
      const logFile = "log.txt";
      const { log } = new FileLogger({
        logFile,
      });

      // Act
      await log`This is ${true}`;

      // Assert
      assertSpyCall(permissionsRequestSpy, 0, {
        args: [{
          name: "write",
          path: logFile,
        }],
      });
      assertSpyCall(writeTextFileSpy, 0, {
        args: [logFile, "This is true\n", {
          append: true,
          create: true,
        }],
      });

      // Restore
      restorePermissionsRequest();
      restoreWriteTextFile();
    });

    await test.step("transformed string", async () => {
      // Arrange
      const [permissionsRequestSpy, restorePermissionsRequest] =
        permissionsRequestSpyFactory();
      const [writeTextFileSpy, restoreWriteTextFile] =
        writeTextFileSpyFactory();
      const logFile = "log.txt";
      const { log } = new FileLogger({
        logFile,
        transformText: (text) => `Ben said "${text}".`,
      });

      // Act
      await log`Hello World!`;

      // Assert
      assertSpyCall(permissionsRequestSpy, 0, {
        args: [{
          name: "write",
          path: logFile,
        }],
      });
      assertSpyCall(writeTextFileSpy, 0, {
        args: [logFile, 'Ben said "Hello World!".\n', {
          append: true,
          create: true,
        }],
      });

      // Restore
      restorePermissionsRequest();
      restoreWriteTextFile();
    });
  });

  await test.step("should log to a file with writeTextFile options", async () => {
    // Arrange
    const [permissionsRequestSpy, restorePermissionsRequest] =
      permissionsRequestSpyFactory();
    const [writeTextFileSpy, restoreWriteTextFile] = writeTextFileSpyFactory();
    const logFile = "log.txt";
    const { signal } = new AbortController();
    const { log } = new FileLogger({
      logFile,
      transformText: (text) => `Ben said "${text}".`,
      writeFileOptions: {
        create: false,
        signal,
      },
    });

    // Act
    await log`Hello World!`;

    // Assert
    assertSpyCall(permissionsRequestSpy, 0, {
      args: [{
        name: "write",
        path: logFile,
      }],
    });
    assertSpyCall(writeTextFileSpy, 0, {
      args: [logFile, 'Ben said "Hello World!".\n', {
        append: true,
        create: false,
        signal,
      }],
    });

    // Restore
    restorePermissionsRequest();
    restoreWriteTextFile();
  });

  await test.step("should not log to the console when disabled", () => {
    // Arrange
    const [permissionsRequestSpy, restorePermissionsRequest] =
      permissionsRequestSpyFactory();
    const [writeTextFileSpy, restoreWriteTextFile] = writeTextFileSpyFactory();
    const logFile = "log.txt";
    const { log } = new FileLogger({
      disabled: true,
      logFile,
    });

    // Act
    log`Hello World!`;

    // Assert
    assertSpyCall(permissionsRequestSpy, 0, {
      args: [{
        name: "write",
        path: logFile,
      }],
    });
    assertEquals(writeTextFileSpy.calls.length, 0);

    // Restore
    restorePermissionsRequest();
    restoreWriteTextFile();
  });
});
