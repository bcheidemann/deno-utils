export async function writeJsonFile<T>(
  path: string | URL,
  object: T,
  options?: Deno.WriteFileOptions,
) {
  const text = JSON.stringify(object);
  await Deno.writeTextFile(path, text, options);
}
