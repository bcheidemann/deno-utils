import { SerializableValue } from "../../utils/types/serializable.ts";
import { defaultOptions } from "./defaultOptions.ts";
import { PermissonNotGrantedError } from "./errors.ts";
import { RunnerOptions } from "./types.ts";

function runnerFactory<RunOptions extends Deno.RunOptions = Deno.RunOptions>({
  options,
  onRun,
  onProcess,
}: RunnerOptions<RunOptions>) {
  return async function run(
    templateStrings: TemplateStringsArray,
    ...expressions: SerializableValue[]
  ): Promise<Deno.ProcessStatus> {
    const cmd = templateStrings
      .map((templateString, i) => [templateString, String(expressions[i])]) // TODO: stringify objects
      .flat()
      .splice(0, templateStrings.length + expressions.length)
      .join("")
      .split(" ");

    const permissions = await Deno.permissions.request({
      name: "run",
      command: cmd[0],
    });

    if (permissions.state !== "granted") {
      throw new PermissonNotGrantedError();
    }

    onRun?.(cmd);

    const process = Deno.run({
      ...options,
      cmd,
    });

    onProcess?.(process as Deno.Process<RunOptions>);

    return await process.status();
  };
}

const baseRunner = runnerFactory(defaultOptions);

type Runner = typeof baseRunner;

const enhancedRunner = baseRunner as Runner & {
  opts: typeof runnerFactory;
};

enhancedRunner.opts = runnerFactory;

export const run = enhancedRunner;
