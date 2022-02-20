export async function readJsonFile<T>(
  path: string | URL,
  options?: Deno.ReadFileOptions,
): Promise<T> {
  const text = await Deno.readTextFile(path, options);
  const json = JSON.parse(text);
  return json;
}
