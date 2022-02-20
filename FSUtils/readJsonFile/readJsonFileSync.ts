export function readJsonFileSync<T>(path: string | URL): Promise<T> {
  const text = Deno.readTextFileSync(path);
  const json = JSON.parse(text);
  return json;
}
