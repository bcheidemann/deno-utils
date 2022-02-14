import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.125.0/testing/asserts.ts";
import { Stub, stub } from "https://deno.land/x/mock@0.13.0/stub.ts";
import { assertSpyCall, spy } from "https://deno.land/x/mock@0.13.0/mod.ts";
import { PermissonNotGrantedError } from "../errors.ts";
import { run } from "../run.ts";

const mockRequestFactory = (status: Partial<Deno.PermissionStatus>) =>
  () => status as Promise<Deno.PermissionStatus>;
const mockStatusFactory = (status: Partial<Deno.ProcessStatus>) =>
  () => status as Promise<Deno.ProcessStatus>;
const mockRunFactory = <T extends Deno.RunOptions = Deno.RunOptions>(
  process: Partial<Deno.Process<T>>,
) => () => process as Deno.Process<T>;

Deno.test("run", async (test) => {
  await test.step("should throw if permissions are not granted", async () => {
    // Arrange
    const mockRequest = mockRequestFactory({
      state: "denied",
    });
    const requestStub: Stub<Deno.Permissions> = stub(
      Deno.permissions,
      "request",
      mockRequest,
    );

    // Act
    async function act() {
      await run`echo test`;
    }

    // Assert
    await assertRejects(act, PermissonNotGrantedError);

    // Restore
    requestStub.restore();
  });

  await test.step("should run command", async () => {
    // Arrange
    const mockRequest = spy(
      mockRequestFactory({
        state: "granted",
      }),
    );
    const requestStub: Stub<Deno.Permissions> = stub(
      Deno.permissions,
      "request",
      mockRequest,
    );
    const mockStatus = mockStatusFactory({
      success: true,
    });
    const mockRun = spy(
      mockRunFactory({
        status: mockStatus,
      }),
    );
    const runStub: Stub<typeof Deno> = stub(Deno, "run", mockRun);

    // Act
    const { success } = await run`echo test`;

    // Assert
    assertEquals(success, true);
    assertSpyCall(mockRequest, 0, { args: [{ name: "run", command: "echo" }] });
    assertSpyCall(mockRun, 0, { args: [{ cmd: ["echo", "test"] }] });

    // Restore
    requestStub.restore();
    runStub.restore();
  });

  await test.step("should run command with template variables", async () => {
    // Arrange
    const mockRequest = spy(
      mockRequestFactory({
        state: "granted",
      }),
    );
    const requestStub: Stub<Deno.Permissions> = stub(
      Deno.permissions,
      "request",
      mockRequest,
    );
    const mockStatus = mockStatusFactory({
      success: true,
    });
    const mockRun = spy(
      mockRunFactory({
        status: mockStatus,
      }),
    );
    const runStub: Stub<typeof Deno> = stub(Deno, "run", mockRun);

    // Act
    const { success } = await run`echo ${"test abc"} ${123} ${true}`;

    // Assert
    assertEquals(success, true);
    assertSpyCall(mockRequest, 0, { args: [{ name: "run", command: "echo" }] });
    assertSpyCall(mockRun, 0, {
      args: [{ cmd: ["echo", "test", "abc", "123", "true"] }],
    });

    // Restore
    requestStub.restore();
    runStub.restore();
  });

  await test.step("should run command with options", async () => {
    // Arrange
    const onRun = spy();
    const onProcess = spy();
    const runWithOpts = run.opts({
      onRun,
      onProcess,
      options: {
        cwd: "/",
      },
    });
    const mockRequest = spy(
      mockRequestFactory({
        state: "granted",
      }),
    );
    const requestStub: Stub<Deno.Permissions> = stub(
      Deno.permissions,
      "request",
      mockRequest,
    );
    const mockStatus = mockStatusFactory({
      success: true,
    });
    const mockProcess = {
      status: mockStatus,
    };
    const mockRun = spy(mockRunFactory(mockProcess));
    const runStub: Stub<typeof Deno> = stub(Deno, "run", mockRun);

    // Act
    const { success } = await runWithOpts`echo test`;

    // Assert
    assertEquals(success, true);
    assertSpyCall(mockRequest, 0, { args: [{ name: "run", command: "echo" }] });
    assertSpyCall(onRun, 0, { args: [["echo", "test"]] });
    assertSpyCall(mockRun, 0, { args: [{ cmd: ["echo", "test"], cwd: "/" }] });
    assertSpyCall(onProcess, 0, { args: [mockProcess] });

    // Restore
    requestStub.restore();
    runStub.restore();
  });
});
