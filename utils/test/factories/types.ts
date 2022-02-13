export type NamedArgOptions = {
  type: "named";
  equals?: boolean;
  name: string;
  values: string[];
};

export type AliasedArgOptions = {
  type: "aliased";
  equals?: boolean;
  alias: string;
  values: string[];
};

export type AnonymousArgOptions = {
  type: "anonymous";
  value: string;
};

export type ArgOptions =
  | NamedArgOptions
  | AliasedArgOptions
  | AnonymousArgOptions;

export type ArgObject<T extends ArgOptions = ArgOptions> = T & {
  args: string[];
};

export type NamedArgObject = ArgObject<NamedArgOptions>;
export type AliasedArgObject = ArgObject<AliasedArgOptions>;
export type AnonymousArgObject = ArgObject<AnonymousArgOptions>;
