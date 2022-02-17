export type RunnerOptions<
  RunOptions extends Deno.RunOptions = Deno.RunOptions,
> = {
  options?: Omit<RunOptions, "cmd">;
  onRun?: (cmd: Array<string>) => void;
  onProcess?: (process: Deno.Process<RunOptions>) => void;
};
