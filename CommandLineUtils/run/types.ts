export type SerializableKey = string | number;
export type SerializableValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | SerializableObject;
export type SerializableObject = {
  [key: SerializableKey]: SerializableValue;
};

export type RunnerOptions<
  RunOptions extends Deno.RunOptions = Deno.RunOptions,
> = {
  options?: Omit<RunOptions, "cmd">;
  onRun?: (cmd: Array<string>) => void;
  onProcess?: (process: Deno.Process<RunOptions>) => void;
};
