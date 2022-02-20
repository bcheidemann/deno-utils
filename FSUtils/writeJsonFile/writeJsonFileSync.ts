export function writeJsonFileSync<T>(
  path: string | URL,
  object: T,
  options?: Deno.WriteFileOptions,
) {
  const text = JSON.stringify(object);
  Deno.writeTextFileSync(path, text, options);
}
